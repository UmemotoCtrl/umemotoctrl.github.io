const delim = "&&";
const mathDelim1 = new Array("\\${2}", "\\${2}");	// in Regex form, = "$$ ... $$"
const mathDelim2 = new Array("\\\\\[", "\\\\\]");	// in Regex form, altanative, = "\[ ... \]"
const tabTo = "  ";
const codeLangPrefix = "language-";

function mdInlineParser( argText, argFunc, listType ) {
	// Evacuating comments and formulas --
	let evacuatedText;
	evacuatedText = argText.match(  /`(.+?)`/g );
	argText       = argText.replace(/`(.+?)`/g, delim+delim+"IC"+delim+delim);
	let evacuatedMath;
	evacuatedMath = argText.match(  /\$(.+?)\$/g );
	argText       = argText.replace(/\$(.+?)\$/g, delim+delim+"IM"+delim+delim);
	// -- Evacuating comments and formulas
	argText = argText.replace(/\[(.+?)\]\((.+?)\)/g, "<a href='$2'>$1</a>");	// Anchor Link
	argText = argText.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");	// Strong
	argText = argText.replace(/~~(.+?)~~/g, "<strike>$1</strike>");	// Strike
	argText = argText.replace(/\*(.+?)\*/g, "<em>$1</em>");	// Emphasize

	if (argFunc != null && listType != null)
		argText = argFunc(argText, listType);
	else if (argFunc != null && listType == null)
		argText = argFunc(argText);
	
	// Restoring comments and formulas --
	if (evacuatedMath != null)
		for (let ii = 0; ii < evacuatedMath.length; ii++)
			argText = argText.replace(delim+delim+"IM"+delim+delim, evacuatedMath[ii]);
	if (evacuatedText != null)
		for (let ii = 0; ii < evacuatedText.length; ii++)	// $ is reduced in replace method
			argText = argText.replace(delim+delim+"IC"+delim+delim,
				"<code>"+ evacuatedText[ii].replace( /\$/g, "$$$$$$").replace(/`/g,"").replace(/</g,'&lt;').replace(/>/g,'&gt;') +"</code>");
	// -- Restoring comments and formulas
	return argText;
}

function mdTBParser( argText ) {
	let retText = "";
	let lineText = argText.split(/\n/);
	// For 2nd line
	let items = lineText[1].replace(/^\|\s*/, "").replace(/\s*\|$/, "").split(/\s*\|\s*/g);
	let alignText = new Array();
	for (let jj = 0; jj < items.length; jj++)
		if ( /^:[\s-]+:$/.test(items[jj]) )
			alignText.push(" style='text-align:center'");	// center align
		else if( /^:[\s-]+$/.test(items[jj]) )
			alignText.push(" style='text-align:left'");		// left align
		else if( /^[\s-]+:$/.test(items[jj]) )
			alignText.push(" style='text-align:right'");	// right align
		else
			alignText.push("");
	// For 1st line
	retText = "<table>\n";
	retText +=  "<thead><tr>\n";
	items = lineText[0].replace(/^\|\s*/, "").replace(/\s*\|$/, "").split(/\s*\|\s*/g);
	for (let jj = 0; jj < alignText.length; jj++)
		retText +=  "<th"+alignText[jj]+">" + items[jj] + "</th>\n";
	// For 3rd and more
	retText +=  "</tr></thead>\n";
	retText +=  "<tbody>\n";
	for (let kk = 2; kk < lineText.length; kk++) {
		lineText[kk] = lineText[kk].replace(/^\|\s*/, "");
		items = lineText[kk].split(/\s*\|+\s*/g);
		let colDivText = lineText[kk].replace(/\s/g, "").match(/\|+/g);
		retText +=  "<tr>\n";
		for (let jj = 0; jj < (colDivText||[]).length; jj++)
			if (colDivText[jj] == "|")
				retText +=  "<td"+alignText[jj]+">" + items[jj] + "</td>\n";
			else
				retText +=  "<td"+alignText[jj]+" colspan='"+colDivText[jj].length+"'>" + items[jj] + "</td>\n";
		retText +=  "</tr>\n";
	}
	retText +=  "</tbody></table>";
	return retText;
}
function checkListDepth ( argLine ) {
	let listType = checkListType ( argLine );
	let spaceRegex;
	if (listType == "OL")
		spaceRegex = new RegExp("^\\s*?(?=\\d+\\.\\s+.*?$)");
	else
		spaceRegex = new RegExp("^\\s*?(?=[-+*]\\s+.*?$)");
	let depth;
	let spaceText = argLine.match(spaceRegex);
	if (spaceText == null)
		depth = 0;
	else
		depth = spaceText[0].length;
	return depth;
}
function checkListType ( argLine ) {
	argLine = argLine.replace(/\n/g, "");
	olRegex = new RegExp("^\\s*?\\d+\\.\\s+.*?$");
	ulRegex = new RegExp("^\\s*?[-+*]\\s+.*?$");
	if ( olRegex.test(argLine) )
		return "OL";
	else if ( ulRegex.test(argLine) )
		return "UL";
	else
		return "RW";
}
function mdListParser ( argText, listType ) {
	let lines = argText.split(/\n/g);
	let depth = checkListDepth(lines[0]);
	let retText = "";
	let listRegex;
	if (listType == "OL")
		listRegex = new RegExp("^\\s*?\\d+\\.\\s+(.*?)$");
	else
		listRegex = new RegExp("^\\s*?[-+*]\\s+(.*?)$");
	retText += "<"+listType.toLowerCase()+"><li>";
	let lineDepth, lineType;
	for (let jj = 0; jj < (lines||[]).length; jj++) {
		lineDepth = checkListDepth(lines[jj]);
		lineType = checkListType(lines[jj]);
		if ( lineDepth == depth && lineType == listType) {	// add new item
			retText += "</li>\n<li>"+lines[jj].replace(listRegex, "$1");
			for (let kk = jj+1; kk < (lines||[]).length; kk++) {
				if ( checkListType(lines[kk]) == "RW" )
					retText += lines[kk]+"\n";
				else {
					jj = kk-1;
					break;
				}
			}
		} else if ( lineDepth >= depth+2 ) {	// create nested list
			let tempText = "";
			for (let kk = jj; kk < (lines||[]).length; kk++) {
				if ( checkListType(lines[kk]) == "RW" ){
					tempText += lines[kk]+"\n";
					if ( kk+1==(lines||[]).length ) {
						retText += mdListParser ( tempText, lineType ).replace(/\n$/, "");
						jj = kk;
						break; 
					} 
				} else if ( lineDepth>checkListDepth(lines[kk]) ) {
					retText += mdListParser ( tempText, lineType ).replace(/\n$/, "");
					jj = kk-1;
					break;
				} else {
					tempText += lines[kk]+"\n";
					if ( kk+1==(lines||[]).length ) {
						retText += mdListParser ( tempText, lineType ).replace(/\n$/, "");
						jj = kk;
						break; 
					}
				}
			}
		}
	}

	retText += "</li></"+listType.toLowerCase()+">";
	return retText.replace(/<li>\n*<\/li>/g, "");
}

function restore( argText, tag, aftText, regex, restore) {
	for (let jj = 0; jj < (aftText||[]).length; jj++) {
		let temp;
		switch (tag){
			case "MA":case "MB":case "CB":case "CC":case "CM":	// $ is reduced in replace method
				temp = aftText[jj].replace( /\$/g, "$$$$").replace( regex, restore );
				argText = argText.replace( delim+tag+delim, temp );
				break;
			case "TB":
				temp = aftText[jj].replace( regex, restore );
				argText = argText.replace( delim+tag+delim, mdInlineParser( temp, mdTBParser, null ) );
				break;
			case "UL":case "OL":
				temp = aftText[jj].replace( regex, restore );
				argText = argText.replace( delim+tag+delim, mdInlineParser( temp, mdListParser, tag ) );
				break;
			default:
				if (/H\d/.test(tag)) {
					temp = aftText[jj].replace(/'/g, "").replace( regex, restore );
					temp = mdInlineParser(temp, null, null);
					argText = argText.replace( delim+tag+delim, temp );
				} else {
					temp = aftText[jj].replace( regex, restore );
					temp = mdInlineParser(temp, null, null);
					argText = argText.replace( delim+tag+delim, temp );
				}
				break;
		}
	}
	return argText;
}

function mdp( argText ) {
	// pre-formatting
	argText = argText.replace(/\r\n?/g, "\n");	// Commonize line break codes between Win and mac.
	argText = argText.replace(/\t/g, tabTo);
	argText = "\n"+ argText + "\n\n";

	// Making lists for structure analysis
	let regexArray = new Array();
	let tagArray = new Array();
	let restoreArray = new Array();
	let resRegexArray = new Array();
	tagArray.push("CB");	// Code block with code name
	regexArray.push( new RegExp("\\n\\`\\`\\`.+?\\n[\\s\\S]*?\\n\\`\\`\\`(?=\\n)", 'g') );
	restoreArray.push( "<pre><code class='"+codeLangPrefix+"$1'>$2</code></pre>" );
	resRegexArray.push( new RegExp("^\\n*\\`\\`\\`(.+?)\\n([\\s\\S]*)\\n\\`\\`\\`\\n*$") );
	tagArray.push("CC");	// Code block without code name
	regexArray.push( new RegExp("\\n\\`\\`\\`\\n[\\s\\S]*?\\n\\`\\`\\`(?=\\n)", 'g') );
	restoreArray.push( "<pre><code>$1</code></pre>" );
	resRegexArray.push( new RegExp("^\\n*\\`\\`\\`\\n([\\s\\S]*)\\n\\`\\`\\`\\n*$") );
	tagArray.push("CM");	// HTML comment block
	regexArray.push( new RegExp("\\n<!--[\\s\\S]*?-->(?=\\n)", 'g') );
	restoreArray.push( "$1" );
	resRegexArray.push( new RegExp("^\\n*(<!--[\\s\\S]*?-->)\\n*$") );
	tagArray.push("MA");	// Math block
	regexArray.push( new RegExp("\\n"+mathDelim1[0]+"\\n[\\s\\S]+?\\n"+mathDelim1[1]+"(?=\\n)", 'g') );
	restoreArray.push( "$1" );
	resRegexArray.push( new RegExp("^\\n*([\\s\\S]*)\\n*$") );
	tagArray.push("MB");	// Math block
	regexArray.push( new RegExp("\\n"+mathDelim2[0]+"\\n[\\s\\S]+?\\n"+mathDelim2[1]+"(?=\\n)", 'g') );
	restoreArray.push( "$1" );
	resRegexArray.push( new RegExp("^\\n*([\\s\\S]*)\\n*$") );

	for (let jj = 1; jj < 5; jj++) {
		tagArray.push("H"+jj);
		regexArray.push( new RegExp("\\n#{"+jj+"}\\s+.*?(?=\\n)", 'g') );
		restoreArray.push( "<h"+jj+" class='$1'>$1</h"+jj+">" );
		resRegexArray.push( new RegExp("^\\n*#{"+jj+"}\\s+(.*?)\\n*$") );
	}

	tagArray.push("TB");
	regexArray.push( new RegExp("\\n\\n\\|.+?\\|\\s*?\\n\\|[-:|\\s]*?\\|\\s*?\\n\\|.+?\\|[\\s\\S]*?(?=\\n\\n)", 'g') );
	restoreArray.push( "$1" );
	resRegexArray.push( new RegExp("^\\n*([\\s\\S]*)\\n*$") );
	tagArray.push("UL");
	regexArray.push( new RegExp("\\n\\n\\s*[-+*]\\s[\\s\\S]*?(?=\\n\\n)", 'g') );
	restoreArray.push( "$1" );
	resRegexArray.push( new RegExp("^\\n*([\\s\\S]*)\\n*$") );
	tagArray.push("OL");
	regexArray.push( new RegExp("\\n\\n\\s*\\d+?\\.\\s[\\s\\S]*?(?=\\n\\n)", 'g') );
	restoreArray.push( "$1" );
	resRegexArray.push( new RegExp("^\\n*([\\s\\S]*)\\n*$") );
	tagArray.push("HR");
	regexArray.push( new RegExp("\\n\\s*?-{3,}\\s*(?=\\n)", 'g') );
	restoreArray.push( "<hr>" );
	resRegexArray.push( new RegExp("^\\n*[\\s\\S]*\\n*$") );
	tagArray.push("PP");
	regexArray.push( new RegExp("\\n[^"+delim[0]+"\\n][\\s\\S]*?(?=\\n\\n)", 'g') );
	restoreArray.push( "<p>$1</p>" );
	resRegexArray.push( new RegExp("^\\n*([\\s\\S]*)\\n*$") );

	// Convert to Structure Notation
	let stringArray = new Array();
	for (let ii = 0; ii < tagArray.length; ii++) {
		stringArray.push( argText.match(regexArray[ii]) );
		argText = argText.replace( regexArray[ii], "\n\n"+delim+tagArray[ii]+delim+"\n\n" );
	}
	argText = argText.replace(/\n{2,}/g, "\n");

	// Restore to html
	for (let ii = 0; ii < tagArray.length; ii++) {
		argText = restore( argText, tagArray[ii], stringArray[ii], resRegexArray[ii], restoreArray[ii]);
	}

	return argText;
}