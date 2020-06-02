// for MathJax
window.MathJax = {
	tex: {
		inlineMath: [['$', '$'], ['\\(', '\\)']]
	}
};

$(document).ready(function(){
	// メニューの読み込み
	$.ajax({
		url: "./md/topMenu.md",
		success: function($data) {
			$("#TopMenu").html( mdp($data) );
		}
	});
	// URLから判別しコンテンツファイルの読み込み
	if (location.search=="") {
		$file="./md/index.md";
	} else {
		$strs = location.search.split("?id=")[1].split(":");
		$file = "./md";
		for (let i = 0; i < $strs.length; i++) {
			$file = $file + "/" + $strs[i];
		}
		$file = $file + ".md";
	}
	$.ajax({
		url: $file,
		success: function($data) {
			$("#article").html( mdp($data) );
			try {// MathJaxのロードが早かった場合
				MathJax.typeset($("#article"));
			} catch (e) {
			}
		}
	});
});
