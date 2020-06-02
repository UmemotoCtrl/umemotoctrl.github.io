// for MathJax
window.MathJax = {
	tex: {
		inlineMath: [['$', '$'], ['\\(', '\\)']]
	}
};

$(document).ready(function(){
	$.ajax({
		url: "./md/topMenu.md",
		success: function($data) {
			$("#TopMenu").html( $data );
		}
	});
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
			/* GitHub Pagesの更新日時はコミット時に全部更新のよう．使えず
			var time = new Date( request.getResponseHeader("last-modified") );
			var time = new Date("Fri, 08 May 2020 09:35:53 GMT");
			var datestr = String(time.getFullYear())+"年"+String(time.getMonth()+1)+"月"+String(time.getDate())+"日";
			tagstr = `<p><b>更新日：${datestr}</b></p>`;
			${String(time.getHours())}:${String(time.getMinutes())}
			$("#article").html( marked($data)+tagstr );
			*/
			$("#article").html( mdp($data) );
			// $("#article").html( formattedMarked($data) );
			// for MathJax
			try {
				MathJax.typeset($("#article"));
			} catch (e) {
				console.log('読み込み順序でエラーが出ることがあるのでtry');
				console.log(e);
				setTimeout(function(){
					MathJax.typeset($("#article"));
				},1000);
			}
			hljs.initHighlightingOnLoad();
			$data2 = mdp($data);
			$("#rawmd").html( $data2.replace(/</g,'&lt;').replace(/>/g,'&gt;') );
			// $data3 = marked($data);
			// $("#rawmarked").html( $data3.replace(/</g,'&lt;').replace(/>/g,'&gt;') );
		}
	});
});

// // markedで＼の数が減るのなどの対策
// function formattedMarked( argText ) {
// 	argText = argText.replace(/\\\\/g, '\\\\\\\\');
// 	argText = argText.replace(/\\[|{}_^]/g, '\\$&');
// 	argText = argText.replace(/~/g, ' ~ ');
// 	argText = argText.replace(/\\\|/g, '\\\\~');
// 	argText = argText.replace(/([rl])\|/g, '$1~');
// 	argText = marked(argText);
// 	argText = argText.replace(/\\[~]/g, '\\|');
// 	argText = argText.replace(/([rl])[~]/g, '$1|');
// 	return argText;
// }

// function mdParser2 ( argText ) {
// 	const PLANE_MODE = 0;
// 	const P_MODE = 1;
// 	const TALBE_MODE = 2;
// 	const COMMENT_MODE = 3;
// 	var mode = PLANE_MODE;

// 	var tempText = argText.split(/\n/g);
// 	var retText = tempText[0].replace(/^# (.*?)$/g, "<h1 class='$1'>$1</h1>");
// 	var evacuatedText = null;
// 	for (let ii = 1; ii < tempText.length; ii++) {
// 		if (mode != COMMENT_MODE) {
// 			// .replace(/</g,'&lt;').replace(/>/g,'&gt;')
// 			// コメント--
// 			evacuatedText = tempText[ii].match(/`(.+?)`/g);
// 			tempText[ii] = tempText[ii].replace(/`(.+?)`/g, "___EVTEXT___");
// 			// --コメント
// 			tempText[ii] = tempText[ii].replace(/\[(.+?)\]\((.+?)\)/g, "<a href='$2'>$1</a>");	// リンク
// 			tempText[ii] = tempText[ii].replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");	// 強調strong
// 			tempText[ii] = tempText[ii].replace(/~~(.+?)~~/g, "<strike>$1</strike>");	// 打ち消し
// 			tempText[ii] = tempText[ii].replace(/\*(.+?)\*/g, "<em>$1</em>");	// 強調em
// 			if (tempText[ii].search(/^#+\s(.*?)$/g) >= 0) {	//章と節
// 				var sectionLine = tempText[ii].replace(/^## (.*?)$/g, "<h2 class='$1'>$1</h2>");
// 				sectionLine = sectionLine.replace(/^### (.*?)$/g, "<h3 class='$1'>$1</h3>");
// 				sectionLine = sectionLine.replace(/^#### (.*?)$/g, "<h4 class='$1'>$1</h4>");
// 				sectionLine = sectionLine.replace(/^##### (.*?)$/g, "<h5 class='$1'>$1</h5>");
// 				tempText[ii] = sectionLine;
// 			} else {
// 				// console.log(tempText[ii]);
// 			}
// 			// コメント　動いてない
// 			if (evacuatedText != null) {
// 				for (let ii = 0; ii < evacuatedText.length; ii++) {
// 					tempText[ii] = tempText[ii].replace(/___EVTEXT___/, evacuatedText[ii]);
// 				}
// 			}
			

// 		}
// 		// コメント，表でなければ，$data.replace(/</g,'&lt;').replace(/>/,'&gt;')
// 		// 段落判定も必要 空白行で終了判定する？
		
// 		if (mode == P_MODE && !tempText[ii] ) {	//空行なら
// 			mode = PLANE_MODE;
// 			retText += "</p>";
// 			// console.log(tempText[ii]);
// 		} else if (mode == PLANE_MODE && tempText[ii]) {//直す！！！
// 			mode = P_MODE;
// 			retText += "<p>";
// 		}
// 		retText += tempText[ii];
// 	}
// 	return retText;
// }

// function mdParserUncomment( argText ) {
// 	// コメント --
// 	var evacuatedText;
// 	evacuatedText = argText.match(  /`(.+?)`/g );
// 	argText       = argText.replace(/`(.+?)`/g, "___EV___");
// 	var evacuatedMath;
// 	evacuatedMath = argText.match(  /\$(.+?)\$/g );
// 	argText       = argText.replace(/\$(.+?)\$/g, "___EVMATH___");
// 	// -- コメント
// 	argText = argText.replace(/\[(.+?)\]\((.+?)\)/g, "<a href='$2'>$1</a>");	// リンク
// 	argText = argText.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");	// 強調strong
// 	argText = argText.replace(/~~(.+?)~~/g, "<strike>$1</strike>");	// 打ち消し
// 	argText = argText.replace(/\*(.+?)\*/g, "<em>$1</em>");	// 強調em
// 	// 段落 --
// 	var paragraphText = argText.split(/\n\n/);
// 	argText = "";
// 	for (let ii = 0; ii < paragraphText.length; ii++) {
// 		if (paragraphText[ii] != null) {
// 			if ( /^\|.+?\|.+?\n\|.*?-+?.*?\|\n\|.+/.test(paragraphText[ii]) ) {	// 表
// 				var lineText = paragraphText[ii].split(/\n/);
// 				paragraphText[ii] = "<table>\n";
// 				paragraphText[ii] +=  "<thead><tr>\n";
// 				var items = lineText[0].replace(/^\|\s*/, "").replace(/\s*\|$/, "").split(/\s*\|\s*/g);
// 				for (let jj = 0; jj < items.length; jj++) {
// 					paragraphText[ii] +=  "<th>" + items[jj] + "</th>\n";
// 				}
// 				paragraphText[ii] +=  "</tr></thead>\n";
// 				paragraphText[ii] +=  "<tbody>\n";
// 				for (let kk = 2; kk < lineText.length; kk++) {
// 					var items = lineText[kk].replace(/^\|\s*/, "").replace(/\s*\|$/, "").split(/\s*\|\s*/g);
// 					paragraphText[ii] +=  "<tr>\n";
// 					for (let jj = 0; jj < items.length; jj++) {
// 						paragraphText[ii] +=  "<td>" + items[jj] + "</td>\n";
// 					}
// 					paragraphText[ii] +=  "</tr>\n";
// 				}
// 				paragraphText[ii] +=  "</tbody></table>\n";
// 			} else if ( /^[-\+\*] /.test(paragraphText[ii]) ) {	// 番号なしリスト
// 				var lineText = paragraphText[ii].split(/\n/);
// 				if (lineText != null) {
// 					paragraphText[ii] = "<ul>\n";
// 					for (let jj = 0; jj < lineText.length; jj++) {
// 						if (/^[-\+\*] .+?$/.test(lineText[jj]))
// 							paragraphText[ii] += "<li>" + lineText[jj].match( /^[-\+\*] (.+?)$/ )[1] + "</li>\n";
// 						else {
// 							paragraphText[ii] += "<ul>\n";
// 							for (let kk = jj; kk < lineText.length; kk++) {
// 								if (!/^  [-\+\*] .+?$/.test(lineText[kk])) {
// 									paragraphText[ii] += "</ul>\n";
// 									jj = kk-1;
// 									break;
// 								} else
// 									paragraphText[ii] += "<li>" + lineText[kk].match( /^  [-\+\*] (.+?)$/ )[1] + "</li>\n";
// 							}
// 						}
// 					}
// 					paragraphText[ii] += "</ul>\n";
// 				}
// 			} else if ( /^\d+?\. /.test(paragraphText[ii]) ) {	// 番号付きリスト
// 				var lineText = paragraphText[ii].split(/\n/);
// 				if (lineText != null) {
// 					paragraphText[ii] = "<ol>\n";
// 					for (let jj = 0; jj < lineText.length; jj++) {
// 						if (/^\d+?\. .+?$/.test(lineText[jj]))
// 							paragraphText[ii] += "<li>" + lineText[jj].match( /^\d+?\. (.+?)$/ )[1] + "</li>\n";
// 						else {
// 							paragraphText[ii] += "<ol>\n";
// 							for (let kk = jj; kk < lineText.length; kk++) {
// 								if (!/^  \d+?\. (.+?)$/.test(lineText[kk])) {
// 									paragraphText[ii] += "</ol>\n";
// 									jj = kk-1;
// 									break;
// 								} else
// 									paragraphText[ii] += "<li>" + lineText[kk].match( /^  \d+?\. (.+?)$/ )[1] + "</li>\n";
// 							}
// 						}
// 					}
// 					paragraphText[ii] += "</ol>\n";
// 				}
// 			} else if (/^\s*?---+?.*?\n*?.*?$/.test(paragraphText[ii])) {
// 				paragraphText[ii] = "<hr>\n"
// 			} else if ( !/^#+? /.test(paragraphText[ii])
// 				&& !/^\$\$\n/.test(paragraphText[ii])
// 				&& !/^[\n\s]+$/.test(paragraphText[ii])
// 				&& paragraphText[ii]
// 				)		// 章と節，数式でない
// 				paragraphText[ii] = "<p>" + paragraphText[ii] + "</p>";
// 			argText += paragraphText[ii] + "\n";
// 		}
// 	}
// 	// -- 段落
// 	// コメント --
// 	if (evacuatedMath != null)
// 		for (let ii = 0; ii < evacuatedMath.length; ii++)
// 			argText = argText.replace("___EVMATH___", evacuatedMath[ii]);
// 	if (evacuatedText != null)
// 		for (let ii = 0; ii < evacuatedText.length; ii++)
// 			argText = argText.replace("___EV___",
// 				"<code>"+ evacuatedText[ii].replace(/`/g,"").replace(/</g,'&lt;').replace(/>/g,'&gt;') +"</code>");
// 	// -- コメント
// 	// 章と節 --
// 	argText = argText.replace(/\n## (.*?)\n/g, "\n<h2 class='$1'>$1</h2>\n");
// 	argText = argText.replace(/\n### (.*?)\n/g, "\n<h3 class='$1'>$1</h3>\n");
// 	argText = argText.replace(/\n#### (.*?)\n/g, "\n<h4 class='$1'>$1</h4>\n");
// 	// -- 章と節
// 	return argText;
// }

// function mdParser3( argText ) {
// 	var retText;
// 	var evacuatedText = null;
// 	argText = argText.replace(/^# (.*?)\n/g, "<h1 class='$1'>$1</h1>\n");
// 	var tempText = argText.split(/\n\`\`\`([^\n]+)\n/g);
// 	var tempText2;
// 	var numberOfCodeBlock = (tempText.length-1)/2;
// 	argText = mdParserUncomment( tempText[0]+"\n" );	
// 	for (let ii = 1; ii <= numberOfCodeBlock; ii++) {
// 		argText += "<pre><code class='language-" + tempText[ii*2-1] + "'>";
// 		tempText2 = tempText[ii*2].split(/\n\`\`\`\n/g);
// 		argText += tempText2[0];
// 		argText += "</code></pre>";
// 		argText += mdParserUncomment( "\n"+tempText2[1]+"\n" );
// 	}
// 	retText = argText;
// 	return retText;
// }
