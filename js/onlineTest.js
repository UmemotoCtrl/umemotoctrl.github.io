// console.log("start");

// for MathJax
window.MathJax = {
	tex: {
		inlineMath: [['$', '$'], ['\\(', '\\)']]
	}
};

function writeHtml ( argText ) {
	$("textarea#mdinput").val( argText );
	$("#article").html( mdp(argText) );
	$("#raw").html( mdp(argText).replace(/</g,'&lt;').replace(/>/g,'&gt;') );
	try {
		MathJax.typeset();
	} catch (e) {
	}
}

$(function() {
	$.ajax({
		url: "./md/topMenu.md",
		success: function($data) {
			$("#TopMenu").html( mdp($data) );
		}
	});
	if (location.search=="") {
		$file="./md/sample.md";
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
			writeHtml ( $data );
		}
	});

	$("textarea#mdinput").on('input', function() {
		writeHtml ( $("textarea#mdinput").val() );
	});
});
