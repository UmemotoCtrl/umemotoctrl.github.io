var translateInnerAnchor = function (argText) {
	argText = argText.replace(/\[(.+?)\]\((\.\/)(?!\?id\=)\)/g, "<a href='javascript:loadMd(\"$2\",true);'>$1</a>");	// Inner Anchor Link
	argText = argText.replace(/\[(.+?)\]\((\.\/\?id\=.*?)\)/g, "<a href='javascript:loadMd(\"$2\",true);'>$1</a>");		// Inner Anchor Link
	return argText;
}
var loadMd = function ( argText, gaSend ) {
	// Load markdown file
	let $file = "./md/" + argText.replace("./?id=","").replace(/:/g, "/") + ".md";
	if (argText=="./") {
		$file="./md/index.md";
	}
	fetch($file).then(function(response) {
		return response.text();
	}).then(function($data) {
		// $("#article").html( mdp($data) );
		$("#article").html( mdp(translateInnerAnchor($data)) );
		document.title = ($("div#article>h1:first-child").text()||"");
		// For Google Analytics SPA ---
		if ( gaSend ) {
			window.history.pushState(null, null, argText);
			scrollTo(0, 0);  // absolute (hr, ver)
			ga('set', 'page', "/"+location.search);
			ga('send', 'pageview');
		}
		// --- For Google Analytics SPA
		if ( MathJax.typesetPromise )
			MathJax.typesetPromise($("#article"));
	});
}

$(document).ready(function(){
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
		var script = $('<script>').attr({
			src: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js',
			async: true
		}).appendTo('head');
		script.onload = (function () {
			// console.log(MathJax);
		})();
	})();
	// Load top menu
	fetch('./md/topMenu.md').then(function(response) {
	  return response.text();
	}).then(function($data) {
		$("#TopMenu").html( mdp(translateInnerAnchor($data)) );
	});
	// Load Main md file
	loadMd( "./"+location.search, false);
});
