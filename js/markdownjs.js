// For MathJax
// if ( !navigator.userAgent.match(/iPhone|Android.+Mobile/) )
// 	$('.MathJax').css('font-size','1em !important');
(function () {
	window.MathJax = {
		tex: {
		inlineMath: [['$', '$'], ['\\(', '\\)']]
		},
		svg: {
		fontCache: 'global'
		}
	};
	var scriptIE = document.createElement("script");
	scriptIE.src  = "https://polyfill.io/v3/polyfill.min.js?features=es6";
	document.getElementsByTagName("head")[0].appendChild(scriptIE);
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src  = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js";
	document.getElementsByTagName("head")[0].appendChild(script);
	script.onload = (function () {
		// console.log(MathJax);
	})();
})();

var translateInnerAnchor = function (argText) {
	argText = argText.replace(/\[(.+?)\]\((\.\/)(?!\?id\=)\)/g, "<a href='javascript:loadMd(\"$2\",true);'>$1</a>");	// Inner Anchor Link
	argText = argText.replace(/\[(.+?)\]\((\.\/\?id\=.*?)\)/g, "<a href='javascript:loadMd(\"$2\",true);'>$1</a>");		// Inner Anchor Link
	return argText;
}
var loadMd = function ( argText, gaSend ) {
	// Load markdown file
	let file = "./md/" + argText.replace("./?id=","").replace(/:/g, "/") + ".md";
	if (argText=="./")
		file="./md/index.md";
	fetch(file).then(function(response) {
		return response.text();
	}).then(function(data) {
		article.innerHTML = mdp.render(translateInnerAnchor(data));
		var h1 = document.querySelector("div#article>h1:first-child");
		document.title = (h1.innerHTML||"");
		// For Google Analytics SPA ---
		if ( gaSend ) {
			window.history.pushState(null, null, argText);
			scrollTo(0, 0);  // absolute (hr, ver)
			ga('set', 'page', "/"+location.search);
			ga('send', 'pageview');
		}
		// --- For Google Analytics SPA
		if ( MathJax.typesetPromise )
			MathJax.typesetPromise();
	});
}

var mdp;
var article;
var topMenu;

window.onload = function() {
	mdp = makeMDP();
	article = document.getElementById("article");
	topMenu = document.getElementById("TopMenu");
	mdInput = document.getElementById("mdInput");
	raw     = document.getElementById("raw");
	// Load top menu
	fetch('./md/topMenu.md').then(function(response) {
		return response.text();
	}).then(function(data) {
		topMenu.innerHTML = mdp.render(translateInnerAnchor(data));
	});
	// Load Main md file
	loadMd( "./"+location.search, false);
}
