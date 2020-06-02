// for MathJax
window.MathJax = {
	tex: {
		inlineMath: [['$', '$'], ['\\(', '\\)']]
	}
};

function translateInnerAnchor (argText) {
	argText = argText.replace(/\[(.+?)\]\((\.\/)(?!\?id\=)\)/g, "<a href='javascript:loadMd(\"$2\",true);'>$1</a>");	// Inner Anchor Link
	argText = argText.replace(/\[(.+?)\]\((\.\/\?id\=.*?)\)/g, "<a href='javascript:loadMd(\"$2\",true);'>$1</a>");		// Inner Anchor Link
	return argText;
}
function loadMd ( argText, gaSend ) {
	// Load markdown file
	let $file = "./md/" + argText.replace("./?id=","").replace(/:/g, "/") + ".md";
	if (argText=="./") {
		$file="./md/index.md";
	}
	$.ajax({
		url: $file,
		success: function($data) {
			// $("#article").html( mdp($data) );
			$("#article").html( mdp(translateInnerAnchor($data)) );
			// For Google Analytics SPA ---
			if ( gaSend ) {
				window.history.pushState(null, null, argText);
				ga('set', 'page', "/"+location.search);
				ga('send', 'pageview');
			}
			// --- For Google Analytics SPA
			try {	// If MathJax is early loaded.
				MathJax.typeset($("#article"));
			} catch (e) {
			}
		}
	});
}

$(document).ready(function(){
	// Load top menu
	$.ajax({
		url: "./md/topMenu.md",
		success: function($data) {
			// $("#TopMenu").html( mdp($data) );
			$("#TopMenu").html( mdp(translateInnerAnchor($data)) );
		}
	});
	loadMd( "./"+location.search, false);
});
