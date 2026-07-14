(function () {
  if (!window.mermaid) return;

  var MERMAID_ATTR = "data-mermaid-src";
  var isRendering = false;

  var getTheme = function () {
    return document.documentElement.getAttribute("data-mode") === "dark" ? "dark" : "default";
  };

  var dedent = function (text) {
    var lines = String(text || "")
      .replace(/\r\n/g, "\n")
      .split("\n");

    while (lines.length && !lines[0].trim()) lines.shift();
    while (lines.length && !lines[lines.length - 1].trim()) lines.pop();

    var indents = lines
      .filter(function (line) {
        return line.trim();
      })
      .map(function (line) {
        return (line.match(/^[ \t]*/) || [""])[0].length;
      });

    var min = indents.length ? Math.min.apply(null, indents) : 0;
    return lines
      .map(function (line) {
        return line.slice(min);
      })
      .join("\n")
      .trim();
  };

  // Mermaid edge text `-- 命中 -->` can produce invalid SVG viewBox in some versions.
  var normalizeEdgeLabels = function (text) {
    return text.replace(/--\s+([^-][\s\S]*?)\s+-->/g, function (_match, label) {
      return "-->|" + String(label).trim() + "|";
    });
  };

  var normalizeSource = function (text) {
    return normalizeEdgeLabels(dedent(text));
  };

  var cacheSources = function () {
    document.querySelectorAll("pre.mermaid, .mermaid").forEach(function (el) {
      if (!el.getAttribute(MERMAID_ATTR)) {
        el.setAttribute(MERMAID_ATTR, el.textContent || "");
      }
    });
  };

  var restoreSources = function () {
    document.querySelectorAll("[" + MERMAID_ATTR + "]").forEach(function (el) {
      var src = normalizeSource(el.getAttribute(MERMAID_ATTR) || "");
      el.removeAttribute("data-processed");
      el.removeAttribute("data-mermaid-id");
      el.removeAttribute("data-mermaid-js");
      el.textContent = src;
      if (!el.classList.contains("mermaid")) el.classList.add("mermaid");
    });
  };

  var markBrokenViewBoxes = function () {
    document.querySelectorAll(".mermaid svg").forEach(function (svg) {
      var viewBox = svg.getAttribute("viewBox") || "";
      if (viewBox.indexOf("Infinity") === -1 && viewBox.indexOf("NaN") === -1) return;

      var host = svg.closest(".mermaid");
      if (!host) return;

      var src = host.getAttribute(MERMAID_ATTR) || "";
      host.innerHTML = "";
      host.classList.add("mermaid-error");
      host.textContent = "Mermaid 图表渲染失败，请检查语法。\n\n" + src;
    });
  };

  var renderMermaid = function () {
    if (isRendering) return Promise.resolve();
    isRendering = true;
    cacheSources();
    restoreSources();

    try {
      window.mermaid.initialize({
        startOnLoad: false,
        theme: getTheme(),
        securityLevel: "loose",
        flowchart: { useMaxWidth: true, htmlLabels: true },
        sequence: { useMaxWidth: true },
        gantt: { useMaxWidth: true }
      });
    } catch (error) {
      console.warn("[joe3] mermaid.initialize", error);
    }

    var nodes = document.querySelectorAll(".mermaid");
    if (!nodes.length) {
      isRendering = false;
      return Promise.resolve();
    }

    var done = function () {
      markBrokenViewBoxes();
      isRendering = false;
    };

    if (typeof window.mermaid.run === "function") {
      return window.mermaid
        .run({ nodes: nodes })
        .catch(function (error) {
          console.warn("[joe3] mermaid.run", error);
        })
        .finally(done);
    }

    try {
      if (typeof window.mermaid.init === "function") {
        window.mermaid.init(undefined, nodes);
      }
    } catch (error) {
      console.warn("[joe3] mermaid.init", error);
    }
    done();
    return Promise.resolve();
  };

  window.JoeHexo = window.JoeHexo || {};
  window.JoeHexo.renderMermaid = renderMermaid;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderMermaid);
  } else {
    renderMermaid();
  }

  var root = document.documentElement;
  var lastMode = root.getAttribute("data-mode");
  var observer = new MutationObserver(function () {
    var mode = root.getAttribute("data-mode");
    if (mode && mode !== lastMode) {
      lastMode = mode;
      renderMermaid();
    }
  });
  observer.observe(root, { attributes: true, attributeFilter: ["data-mode"] });
})();
