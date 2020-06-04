var writeHtml = function ( argText ) {
	$("#article").html( mdp(argText) );
	$("#raw").html( mdp(argText).replace(/</g,'&lt;').replace(/>/g,'&gt;') );
	if ( MathJax.typesetPromise )
		MathJax.typesetPromise($("#article"));
}

$(function() {
	// For MathJax
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
	// Load topMenu
	fetch('./md/topMenu.md').then(function(response) {
		return response.text();
	}).then(function($data) {
		$("#TopMenu").html( mdp($data) );
	});
	// Load main md
	if (location.search=="")
		$file = "./md/sample.md";
	else
		$file = "./md/" + location.search.replace("?id=","").replace(/:/g, "/") + ".md";
	fetch($file).then(function(response) {
		return response.text();
	}).then(function($data) {
		$("textarea#mdinput").val( $data );
		writeHtml( $data );
	});
	$("textarea#mdinput").on('input', function() {
		writeHtml ( $("textarea#mdinput").val() );
	});
});
