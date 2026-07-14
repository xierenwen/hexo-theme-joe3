(function () {
  if (window.__joeStarsReady) return;
  window.__joeStarsReady = true;

  var themeConfig = window.ThemeConfig || {};
  if (themeConfig.enable_stars === false) return;

  var layer = document.getElementById("joe-stars");
  if (!layer) return;

  var count = Math.max(4, Math.min(24, Number(themeConfig.stars_count) || 14));
  var minSize = Number(themeConfig.stars_min_size) || 16;
  var maxSize = Number(themeConfig.stars_max_size) || 26;
  if (maxSize < minSize) maxSize = minSize;

  var base =
    (themeConfig.BASE_RES_URL || "/").replace(/\/?$/, "/") + "img/bg_flower_star.svg";
  var imageSrc = themeConfig.stars_image || base;

  // 官方站是固定视口坐标闪烁；这里用一组分散锚点 + 轻微抖动
  var anchors = [
    [37, 49],
    [95, 85],
    [9, 13],
    [24, 75],
    [20, 49],
    [71, 45],
    [34, 61],
    [54, 75],
    [3, 52],
    [82, 22],
    [62, 12],
    [48, 33],
    [12, 88],
    [88, 58],
    [42, 18],
    [76, 70],
  ];

  var rand = function (min, max) {
    return min + Math.random() * (max - min);
  };

  var createStar = function (index) {
    var anchor = anchors[index % anchors.length];
    var jitterX = rand(-4, 4);
    var jitterY = rand(-3, 3);
    var size = rand(minSize, maxSize);
    var duration = rand(6, 11);
    var delay = -rand(0, duration * 3);
    var peak = rand(0.82, 1);

    var wrap = document.createElement("span");
    wrap.className = "joe-stars__item";
    wrap.style.setProperty("--x", anchor[0] + jitterX + "vw");
    wrap.style.setProperty("--y", anchor[1] + jitterY + "vh");
    wrap.style.setProperty("--peak", String(peak));
    wrap.style.setProperty("--joe-star-size", size + "px");
    wrap.style.animationDuration = duration + "s";
    wrap.style.animationDelay = delay + "s";

    var img = document.createElement("img");
    img.src = imageSrc;
    img.alt = "";
    img.decoding = "async";
    img.draggable = false;
    wrap.appendChild(img);
    return wrap;
  };

  for (var i = 0; i < count; i++) {
    layer.appendChild(createStar(i));
  }
})();
