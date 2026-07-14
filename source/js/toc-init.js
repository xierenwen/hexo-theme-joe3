(function () {
  function initToc() {
    if (!window.ThemeConfig || ThemeConfig.enable_toc === false) return;
    if (typeof tocbot === "undefined") return;
    if (!document.querySelector(".toc-container") || !document.querySelector("#js-toc")) return;

    if (typeof tocbot.destroy === "function") {
      try {
        tocbot.destroy();
      } catch (e) {}
    }

    var isMobile = window.Joe && Joe.isMobile;
    var tocSelector =
      isMobile && document.querySelector("#js-toc-mobile")
        ? "#js-toc-mobile"
        : "#js-toc";

    tocbot.init({
      tocSelector: tocSelector,
      contentSelector: ".joe_detail__article",
      ignoreSelector: ".js-toc-ignore",
      headingSelector: "h1,h2,h3,h4,h5,h6",
      collapseDepth: +(ThemeConfig.toc_depth || 0),
      scrollSmooth: true,
      includeTitleTags: true,
      hasInnerContainers: false,
      headingsOffset: 80,
      scrollSmoothOffset: -80,
      positionFixedSelector: ".toc-container",
      positionFixedClass: "is-position-fixed",
      fixedSidebarOffset: "auto",
    });

    var mount = document.querySelector(tocSelector);
    if (mount && !mount.children.length) {
      mount.innerHTML = '<div class="toc-nodata">暂无目录</div>';
    }

    var containers = document.querySelectorAll(".toc-container");
    containers.forEach(function (el) {
      el.style.display = "block";
      el.classList.add("is-ready");
    });
  }

  window.JoeHexo = window.JoeHexo || {};
  window.JoeHexo.initToc = initToc;

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(initToc);
})();
