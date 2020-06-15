
let writeHTML = function () {
	var htmlTxt = mdp.render(mdInput.value);
	article.innerHTML = htmlTxt;
	raw.innerHTML = htmlTxt.replace(/</g,'&lt;').replace(/>/g,'&gt;');
	if ( MathJax.typesetPromise )
		MathJax.typesetPromise();
}

var mdp;
var mdInput;
var article;
var raw;

window.onload = function() {
	mdp = makeMDP();
	mdInput = document.getElementById("mdInput");
	article = document.getElementById("article");
	raw     = document.getElementById("raw");

	// Load topMenu
	fetch('./md/topMenu.md').then(function(response) {
		return response.text();
	}).then(function($data) {
		window.navbarWoFw.config.colors = ['whitesmoke', 'mediumseagreen', 'rgb(75, 191, 127)'];
		window.navbarWoFw.config.srcHamb = 'https://cdn.jsdelivr.net/gh/UmemotoCtrl/NavWithoutFramework@master/img/hamburger.svg';
		window.navbarWoFw.config.srcCross = 'https://cdn.jsdelivr.net/gh/UmemotoCtrl/NavWithoutFramework@master/img/cross.svg';
		window.navbarWoFw.create('NavBar', mdp.render($data));
		window.navbarWoFw.addH1('md-MathJaxオンライン動作テスト');
		window.navbarWoFw.render();
	});
	// Load main md
	if (location.search=="")
		$file = "./md/sample.md";
	else
		$file = "./md/" + location.search.replace("?id=","").replace(/:/g, "/") + ".md";
	fetch($file).then(function(response) {
		return response.text();
	}).then(function(data) {
		mdInput.innerHTML = data;
		writeHTML( data );
	});
	mdInput.oninput = writeHTML;
	// for MathJax
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
		scriptIE.async = true;
		document.getElementsByTagName("head")[0].appendChild(scriptIE);
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src  = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js";
		script.async = true;
		document.getElementsByTagName("head")[0].appendChild(script);
		script.onload = (function () {
			// console.log(MathJax);
		})();
	})();
}
