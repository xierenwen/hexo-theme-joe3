(function () {
  window.JoeHexo = window.JoeHexo || {};

  var storageKey = "data-mode";
  var root = document.documentElement;
  var themeConfig = window.ThemeConfig || {};
  var isDarkModeEnabled = themeConfig.enable_darkmode !== false;
  var searchBound = false;
  var searchIndexPromise;

  var updateToggleState = function (mode) {
    var lightIcons = document.querySelectorAll(".mode-light");
    var darkIcons = document.querySelectorAll(".mode-dark");

    lightIcons.forEach(function (lightIcon) {
      lightIcon.classList.toggle("active", mode === "light");
    });
    darkIcons.forEach(function (darkIcon) {
      darkIcon.classList.toggle("active", mode === "dark");
    });
  };

  var syncCommentTheme = function () {
    if (
      !window.commonContext ||
      typeof window.commonContext.initCommentTheme !== "function" ||
      !window.Joe ||
      !window.Joe.bloggerGenerateAvatarOpts
    ) {
      return;
    }

    try {
      window.commonContext.initCommentTheme();
    } catch (error) {
      if (themeConfig.enable_debug) console.warn("[joe3] initCommentTheme", error);
    }
  };

  var setMode = function (mode) {
    root.setAttribute("data-mode", mode);
    root.setAttribute("data-color-scheme", mode);
    localStorage.setItem(storageKey, mode);
    updateToggleState(mode);
    syncCommentTheme();
  };

  var getDefaultMode = function () {
    var defaultMode = themeConfig.darkmode_default || "light";
    if (defaultMode === "dark" || defaultMode === "light") return defaultMode;

    if (
      defaultMode === "auto" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }

    return "light";
  };

  if (isDarkModeEnabled) {
    var storedMode = localStorage.getItem(storageKey);
    var initialMode = storedMode === "light" || storedMode === "dark" ? storedMode : getDefaultMode();
    setMode(initialMode);
  }

  var weatherInitialized = false;
  var initWeather = function () {
    if (weatherInitialized) return;
    var weatherContainer = document.querySelector("#joe-weather[data-token]");
    var weatherToken = weatherContainer ? (weatherContainer.getAttribute("data-token") || "").trim() : "";
    if (!weatherContainer || !weatherToken) return;

    weatherInitialized = true;
    var weatherWidgetName = "SeniverseWeatherWidget";
    var weatherScriptUrl = "//cdn.sencdn.com/widget2/static/js/bundle.js?t=" + parseInt((new Date().getTime() / 100000000).toString(), 10);
    var loadWeatherWidget = function () {
      var script = document.createElement("script");
      var firstScript = document.getElementsByTagName("script")[0];
      if (!firstScript || !firstScript.parentNode) return;
      script.src = weatherScriptUrl;
      script.charset = "utf-8";
      script.async = 1;
      firstScript.parentNode.insertBefore(script, firstScript);
    };

    window.SeniverseWeatherWidgetObject = weatherWidgetName;
    window[weatherWidgetName] = window[weatherWidgetName] || function () {
      (window[weatherWidgetName].q = window[weatherWidgetName].q || []).push(arguments);
    };
    window[weatherWidgetName].l = +new Date();

    if (window.attachEvent) {
      window.attachEvent("onload", loadWeatherWidget);
    } else {
      window.addEventListener("load", loadWeatherWidget, false);
    }

    window[weatherWidgetName]("show", {
      flavor: "slim",
      location: "WX4FBXXFKE4F",
      geolocation: true,
      language: "zh-Hans",
      unit: "c",
      theme: "auto",
      token: weatherToken,
      hover: "enabled",
      container: weatherContainer.id
    });
  };

  /* ---- Hitokoto (sidebar) ---- */
  var initHitokoto = function () {
    if (themeConfig.enable_hitokoto === false) return;

    var textEl = document.getElementById("joe-hitokoto-text");
    var fromEl = document.getElementById("joe-hitokoto-from");
    var card = document.getElementById("joe-hitokoto");
    if (!textEl || !card) return;

    textEl.textContent = "加载中…";
    if (fromEl) fromEl.hidden = true;

    var api = themeConfig.hitokoto_api || "https://v1.hitokoto.cn";
    var type = (themeConfig.hitokoto_type || "").trim();
    var url = api + (api.indexOf("?") === -1 ? "?" : "&") + "encode=json";
    if (type) url += "&c=" + encodeURIComponent(type);

    var failSoft = function () {
      textEl.textContent = "获取一言失败";
      if (fromEl) fromEl.hidden = true;
    };

    fetch(url, { credentials: "omit" })
      .then(function (response) {
        if (!response.ok) throw new Error("hitokoto http " + response.status);
        return response.json();
      })
      .then(function (data) {
        var line = (data && data.hitokoto) || "";
        if (!line) {
          failSoft();
          return;
        }
        textEl.textContent = line;
        if (fromEl) {
          var source = data.from_who || data.from || "";
          if (source) {
            fromEl.textContent = "— " + source;
            fromEl.hidden = false;
          } else {
            fromEl.hidden = true;
          }
        }
      })
      .catch(failSoft);
  };

  /* ---- Hexo highlight code chrome ---- */
  var getHighlightLang = function (figure) {
    var classes = (figure.className || "").split(/\s+/);
    for (var i = 0; i < classes.length; i++) {
      var name = classes[i];
      if (name && name !== "highlight" && name !== "joe-code" && name.indexOf("joe-code") !== 0) {
        return name;
      }
    }
    return "code";
  };

  var getHighlightText = function (figure) {
    var codeCell = figure.querySelector("td.code") || figure.querySelector(".code");
    if (codeCell) {
      var lines = codeCell.querySelectorAll(".line");
      if (lines.length) {
        return Array.prototype.map.call(lines, function (line) {
          return line.textContent || "";
        }).join("\n");
      }
      return codeCell.textContent || "";
    }
    var pre = figure.querySelector("pre");
    return pre ? pre.textContent || "" : figure.textContent || "";
  };

  var enhanceHighlightBlocks = function () {
    var enableTitle = themeConfig.enable_code_title !== false;
    var enableMacdot = themeConfig.enable_code_macdot !== false;
    var enableCopy = themeConfig.enable_code_copy !== false;
    if (!enableTitle && !enableMacdot && !enableCopy) return;

    var figures = document.querySelectorAll(".joe_detail__article figure.highlight");
    if (!figures.length) return;

    figures.forEach(function (figure) {
      if (figure.getAttribute("data-joe-code") === "1") return;
      figure.setAttribute("data-joe-code", "1");
      figure.classList.add("joe-code");

      if (enableMacdot) figure.classList.add("joe-code--macdot");

      if (enableTitle) {
        var title = document.createElement("div");
        title.className = "joe-code__title";
        title.textContent = getHighlightLang(figure);
        figure.appendChild(title);
      }

      if (enableCopy && typeof window.ClipboardJS !== "undefined") {
        var button = document.createElement("button");
        button.type = "button";
        button.className = "joe-code__copy";
        button.setAttribute("aria-label", "复制代码");
        button.title = "复制代码";
        button.innerHTML = '<i class="joe-font joe-icon-copy" aria-hidden="true"></i>';
        figure.appendChild(button);

        var clipboard = new window.ClipboardJS(button, {
          text: function () {
            return getHighlightText(figure);
          }
        });
        clipboard.on("success", function () {
          if (window.Qmsg && typeof window.Qmsg.success === "function") {
            window.Qmsg.success("复制成功！");
          }
        });
      }
    });
  };

  /* ---- Search modal (event delegation, pjax-safe) ---- */
  var getSearchModal = function () {
    return document.querySelector(".joe_search");
  };

  var setSearchMessage = function (message) {
    var searchModal = getSearchModal();
    if (!searchModal) return;
    var searchResults = searchModal.querySelector(".joe_search__results");
    if (!searchResults) return;
    searchResults.innerHTML = "";
    var empty = document.createElement("div");
    empty.className = "joe_search__empty";
    empty.textContent = message;
    searchResults.appendChild(empty);
  };

  var getSearchIndex = function () {
    var searchModal = getSearchModal();
    var searchPath =
      (searchModal && searchModal.getAttribute("data-search-path")) ||
      themeConfig.search_path ||
      "/search.json";

    if (!searchIndexPromise) {
      searchIndexPromise = fetch(searchPath, { credentials: "same-origin" })
        .then(function (response) {
          if (!response.ok) throw new Error("Failed to load search index");
          return response.json();
        })
        .then(function (data) {
          return Array.isArray(data) ? data : [];
        });
    }

    return searchIndexPromise;
  };

  var getSnippet = function (content, query) {
    var text = content || "";
    var lowerText = text.toLowerCase();
    var lowerQuery = query.toLowerCase();
    var index = lowerText.indexOf(lowerQuery);
    var start = index > 40 ? index - 40 : 0;
    var snippet = text.slice(start, start + 140);
    return (start > 0 ? "..." : "") + snippet + (start + 140 < text.length ? "..." : "");
  };

  var renderSearchResults = function (query, posts) {
    var searchModal = getSearchModal();
    if (!searchModal) return;
    var searchResults = searchModal.querySelector(".joe_search__results");
    if (!searchResults) return;

    var keyword = (query || "").trim().toLowerCase();
    searchResults.innerHTML = "";

    if (!keyword) {
      setSearchMessage("输入关键字搜索文章");
      return;
    }

    var matches = posts.filter(function (post) {
      var title = String(post.title || "").toLowerCase();
      var content = String(post.content || "").toLowerCase();
      return title.indexOf(keyword) !== -1 || content.indexOf(keyword) !== -1;
    }).slice(0, 20);

    if (!matches.length) {
      setSearchMessage("没有找到相关文章");
      return;
    }

    matches.forEach(function (post) {
      var item = document.createElement("a");
      var title = document.createElement("strong");
      var content = document.createElement("p");

      item.className = "joe_search__result";
      item.href = post.url || "#";
      item.setAttribute("role", "listitem");
      title.className = "joe_search__result-title";
      title.textContent = post.title || "Untitled";
      content.className = "joe_search__result-content";
      content.textContent = getSnippet(post.content || "", keyword);

      item.appendChild(title);
      item.appendChild(content);
      searchResults.appendChild(item);
    });
  };

  var openSearch = function () {
    var searchModal = getSearchModal();
    if (!searchModal) return;
    var searchInput = searchModal.querySelector(".joe_search__input");
    searchModal.hidden = false;
    searchModal.setAttribute("aria-hidden", "false");
    setSearchMessage("正在加载搜索索引...");
    getSearchIndex()
      .then(function (posts) {
        renderSearchResults((searchInput && searchInput.value) || "", posts);
      })
      .catch(function () {
        setSearchMessage("搜索索引加载失败");
      });
    if (searchInput) searchInput.focus();
  };

  var closeSearch = function () {
    var searchModal = getSearchModal();
    if (!searchModal) return;
    searchModal.hidden = true;
    searchModal.setAttribute("aria-hidden", "true");
  };

  var bindSearch = function () {
    if (searchBound) return;
    searchBound = true;

    document.addEventListener("click", function (event) {
      var openBtn = event.target.closest && event.target.closest(".joe_search__open");
      if (openBtn) {
        event.preventDefault();
        openSearch();
        return;
      }
      var closeBtn = event.target.closest && event.target.closest("[data-search-close]");
      if (closeBtn) {
        event.preventDefault();
        closeSearch();
      }
    });

    document.addEventListener("input", function (event) {
      if (!event.target || !event.target.classList || !event.target.classList.contains("joe_search__input")) return;
      var query = event.target.value || "";
      getSearchIndex()
        .then(function (posts) {
          renderSearchResults(query, posts);
        })
        .catch(function () {
          setSearchMessage("搜索索引加载失败");
        });
    });

    document.addEventListener("keydown", function (event) {
      var searchModal = getSearchModal();
      if (event.key === "Escape" && searchModal && !searchModal.hidden) closeSearch();
    });
  };

  var refreshPage = function () {
    themeConfig = window.ThemeConfig || themeConfig;
    if (isDarkModeEnabled) {
      var mode = localStorage.getItem(storageKey) || root.getAttribute("data-mode") || "light";
      updateToggleState(mode);
    }
    initHitokoto();
    enhanceHighlightBlocks();
    if (typeof window.JoeHexo.initToc === "function") {
      window.JoeHexo.initToc();
    }
  };

  window.JoeHexo.initHitokoto = initHitokoto;
  window.JoeHexo.enhanceHighlightBlocks = enhanceHighlightBlocks;
  window.JoeHexo.getHighlightLang = getHighlightLang;
  window.JoeHexo.getHighlightText = getHighlightText;
  window.JoeHexo.refreshPage = refreshPage;
  window.JoeHexo.setMode = setMode;

  initWeather();
  initHitokoto();
  enhanceHighlightBlocks();
  bindSearch();
})();
