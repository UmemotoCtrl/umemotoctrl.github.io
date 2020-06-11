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
		// var h1 = document.querySelector("div#article>h1:first-child")|[];
		if (/^# (.+?)$/m.test(data))
			document.title = data.match(/^# (.+?)$/m)[1];
		titleH1.innerHTML = document.title;
		// For Google Analytics SPA ---
		if ( gaSend ) {
			HBIconState = true;
			HBIcon.onclick();
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
var Hamburger;
var HBMenu;
var HBIcon;
var HBIconState = false;
var titleH1;
var NavBar;

window.onload = function() {
	mdp = makeMDP();
	article = document.getElementById("article");
	topMenu = document.getElementById("TopMenu");
	titleH1 = document.getElementById("Title");
	Hamburger = document.getElementById("Hamburger");
	HBMenu = document.getElementById("HBMenu");
	HBIcon = document.getElementById("HBIcon");
	NavBar = document.getElementById("NavBar");

	if ( navigator.userAgent.match(/iPhone|Android.+Mobile/) ) {
	// if (true) {
		topMenu.style.display = 'none';
		NavBar.style.maxHeight = '5rem';
		titleH1.style.fontSize = '3rem';
		const root = document.documentElement;
		root.style.setProperty('--nav-heigh', '5rem');
	} else {
		Hamburger.style.display = 'none';
	}
		
	// Load top menu
	fetch('./md/topMenu.md').then(function(response) {
		return response.text();
	}).then(function(data) {
		topMenu.innerHTML = mdp.render(translateInnerAnchor(data));
		HBMenu.innerHTML = mdp.render(translateInnerAnchor(data));
	});
	this.HBIcon.onclick = function(){
		if (HBIconState) {
			HBIconState = false;
			HBIcon.style.backgroundImage = 'url(/img/hamburger.svg)';
			HBMenu.style.display = 'none';
		} else {
			HBIconState = true;
			HBIcon.style.backgroundImage = 'url(/img/cross.svg)';
			HBMenu.style.display = 'block';
		}
	};

	// Load Main md file
	loadMd( "./"+location.search, false);
}
