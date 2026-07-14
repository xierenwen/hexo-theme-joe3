(function () {
	if (!window.ThemeConfig || ThemeConfig.enable_pjax === false) return;
	if (!window.jQuery || !jQuery.pjax) {
		console.warn("[joe3] pjax libs missing");
		return;
	}

	$(document).pjax('a[target!=_blank]:not([data-no-pjax])', "#Joe", {
		fragment: "#Joe",
		timeout: 8000,
		scrollTo: false,
	});

	if (window.NProgress) {
		NProgress.configure({
			showSpinner: false,
			easing: "ease",
			speed: 400,
		});
	}

	$(document).on("pjax:send", function () {
		if (window.NProgress) NProgress.start();
		if (window.tocbot && typeof tocbot.destroy === "function" && $("#js-toc").length) {
			try {
				tocbot.destroy();
			} catch (e) {}
		}
	});

	$(document).on("pjax:complete", function () {
		if (window.NProgress) NProgress.done();

		// 页面局部能力重刷；全局音乐播放器在 #Joe 外，保持不中断
		if (window.JoeHexo && typeof JoeHexo.refreshPage === "function") {
			JoeHexo.refreshPage();
		}

		if (window.commonContext) {
			[
				"initMode",
				"back2Top",
				"initTimeCount",
				"initCode",
				"foldCode",
				"initWeather",
			].forEach(function (name) {
				if (typeof commonContext[name] === "function") {
					try {
						commonContext[name]();
					} catch (e) {
						if (ThemeConfig.enable_debug) console.warn("[joe3] pjax reinit", name, e);
					}
				}
			});
		}

		if (window.WOW) {
			try {
				new WOW({
					boxClass: "wow",
					animateClass: "animated",
					offset: 0,
					mobile: false,
					live: true,
				}).init();
			} catch (e) {}
		}

		if (window.JoeHexo && typeof JoeHexo.initToc === "function") {
			JoeHexo.initToc();
		} else if (window.tocbot && document.querySelector("#js-toc")) {
			// fallback: re-run toc-init entry if exposed later
		}

		if (window.mermaid && typeof mermaid.run === "function") {
			try {
				mermaid.run({ querySelector: ".mermaid" });
			} catch (e) {}
		}
	});

	$(document).on("pjax:error", function () {
		if (window.NProgress) NProgress.done();
	});
})();
