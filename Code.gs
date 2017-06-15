/**
 * @OnlyCurrentDoc
 *
 * The above comment directs Apps Script to limit the scope of file
 * access for this add-on. It specifies that this add-on will only
 * attempt to read or modify the files in which the add-on is used,
 * and not all of the user's files. The authorization request message
 * presented to users will reflect this limited scope.
 */

/**
 * Creates a menu entry in the Google Docs UI when the document is opened.
 * This method is only used by the regular add-on, and is never called by
 * the mobile add-on version.
 *
 * @param {object} e The event parameter for a simple onOpen trigger. To
 *     determine which authorization mode (ScriptApp.AuthMode) the trigger is
 *     running in, inspect e.authMode.
 */
function onOpen(e) {
	DocumentApp.getUi().createAddonMenu()
		.addItem('Show', 'showSidebar')
		.addToUi();
}

/**
 * Runs when the add-on is installed.
 * This method is only used by the regular add-on, and is never called by
 * the mobile add-on version.
 *
 * @param {object} e The event parameter for a simple onInstall trigger. To
 *     determine which authorization mode (ScriptApp.AuthMode) the trigger is
 *     running in, inspect e.authMode. (In practice, onInstall triggers always
 *     run in AuthMode.FULL, but onOpen triggers may be AuthMode.LIMITED or
 *     AuthMode.NONE.)
 */
function onInstall(e) {
	onOpen(e);
}

/**
 * Opens a sidebar in the document containing the add-on's user interface.
 * This method is only used by the regular add-on, and is never called by
 * the mobile add-on version.
 */
function showSidebar() {
	var ui = HtmlService.createHtmlOutputFromFile('Sidebar')
		.setTitle("Lewd Writer's Assistant");
	DocumentApp.getUi().showSidebar(ui);
}

/**
 * Gets the stored user preferences, if they exist.
 * This method is only used by the regular add-on, and is never called by
 * the mobile add-on version.
 *
 * @return {Object} The user's preferences, if they exist.
 */
function getPreferences() {
	var userProperties = PropertiesService.getUserProperties();
	return {
		applyFormat: userProperties.getProperty('applyFormat')
	};
}


function traceElement(depth, e) {
	function attrstr(attrs) {
		var text = JSON.stringify(attrs);
		text = text.replace(/"\w+":(null|\{\})/g, '');
		text = text.replace(/"LEFT_TO_RIGHT":true/g, '');
		text = text.replace(/,+}/g, '}');
		text = text.replace(/\{,+/g, '{');
		text = text.replace(/,+"/g, ', "');
		return text;
	}

	const TEXT = 80;
	const NODES = 100;
	var indent = '';
	var i, n;
	for (i = 0; i < depth; i++) indent += '\t';

	var type = e.getType();
	var s = indent;
	s += ' type=' + type;

	var text = attrstr(e.getAttributes());
	if (text != '{}') s += ' attrs=' + text;

	if (type == DocumentApp.ElementType.PARAGRAPH) {
		var heading = e.getHeading();
		s += ' level=' + heading;
		s += ' indent=' + Math.max(e.getIndentStart(), e.getIndentFirstLine());
	}
	Logger.log(s);

	if (type == DocumentApp.ElementType.TEXT) {
		var runs = e.getTextAttributeIndices();
		var text = e.getText();
		for (i = 0; i < runs.length; i++) {
			var i1 = runs[i];
			var i2 = (i + 1 == runs.length) ? e.getText().length : runs[i + 1];
			s = indent + '\t' + i1 + '..' + i2 + ': ';

			var subtext = attrstr(e.getAttributes(i1));
			if (subtext != '{}') s += ' attrs=' + subtext;

			subtext = text.substring(i1, i2);
			s += ' text=' + JSON.stringify(subtext.slice(0, TEXT));
			if (subtext.length > TEXT) s += '...[' + subtext.length + ']';

			Logger.log(s);
		}
	}

	var hasChildren = 'getNumChildren' in e;
	if (hasChildren) {
		n = e.getNumChildren();
		if (n > 0) {
			for (i = 0; i < n && i < NODES / 2; i++) {
				traceElement(depth + 1, e.getChild(i));
			}
			if (n > NODES) {
				Logger.log(indent + '\t... (' + (n - NODES) + ' more)');
			}
			if (i + NODES / 2 < n) i = n - NODES / 2;
			for (; i < n; i++) {
				traceElement(depth + 1, e.getChild(i));
			}
		}
	}
}
function setAttr(element,attr,set) {
	var attrs = {};
	attrs[attr] = set;
	element.setAttributes(attrs);
}
function compareAndSetAttr(element,attr,test,set) {
	var oldAttrs = element.getAttributes();
	if ((element[attr]||'').toUpperCase() == test.toUpperCase()) {
		setAttr(element,attr,set);
	}
}
function debugDom() {
	Logger.clear();
	var doc = DocumentApp.getActiveDocument();
	var body = doc.getBody();
	traceElement(0, body);
	return {
		logs: Logger.getLog()
	}
}
function cap1(s) {
	return s.substr(0, 1).toUpperCase() + s.substr(1);
}
function cap0(s) {
	return s.substr(0, 1).toLowerCase() + s.substr(1);
}
function uncomment(s) {
	var i = s.indexOf('//');
	if (i >= 0) return [s.substr(0, i), s.substr(i + 2).trim()];
	return [s, ''];
}
function strip(s, filter) {
	if (filter === undefined) filter = /\s+/g;
	return s.replace(filter, '');
}
var REX_ID = /[^a-zA-Z0-9_$]/g;
var REX_SIMPLE_EXPR = /[^a-zA-Z0-9_$.()]/g;
var REX_EXPR = /[^a-zA-Z0-9_$.,()!><=+']/g;
function identifier(s, filter) {
	if (filter === undefined) filter = REX_ID;
	var ss = s.trim().split(/\s+/);
	for (var i = 0, n = ss.length; i < n; i++) {
		ss[i] = strip(ss[i], filter);
		if (i > 0) ss[i] = cap1(ss[i]);
	}
	//Logger.log('identifier('+JSON.stringify(s)+')='+JSON.stringify(ss.join('')));
	return ss.join('');
}
function findUnescaped(haystack, needle, start) {
	var r = haystack.indexOf(needle, start);
	while (r > 0 && haystack[r - 1] == '\\') r = haystack.indexOf('[', r + 1);
	return r;
}
function transpile(options) {
	if (!options) options = {};
	var userProperties = PropertiesService.getUserProperties()
	userProperties.setProperty('applyFormat',options.applyFormat);
	var styleText = {};
	//styleText[DocumentApp.Attribute.BACKGROUND_COLOR] = '#FFFFAA';
	//styleText[DocumentApp.Attribute.FONT_FAMILY] = 'Times New Roman';
	var groupStyleZero = [null,null,null,0]
	var groupStyles = [
		['#444444', '#888888',
			'#cccccc','#eeeeee',2],
		['#111144', '#222288',
			'#8888cc','#ddddff',0],
		['#441144', '#882288',
			'#cc88cc','#ffddff',2],
		['#441111', '#882222',
			'#cc8888','#ffdddd',2],
		['#443311', '#886622',
			'#ccaa88','#ffeedd',2],
		['#444411', '#888822',
			'#cccc88','#ffffdd',2],
		['#114411', '#228822',
			'#88cc88','#ddffdd',2],
		['#114444', '#228888',
			'#88cccc','#ddffff',2],
		['#111111', '#222222',
			'#888888','#dddddd',2]
	];

	Logger.clear();
	var file, //
		method, //
		configSection,
		sources = [];
	var result = {};
	var tabs = '';
	var prevText = '';
	var blockDepth = 0;
	var doSilentOpen = false;
	var silentOpenCounter = 0;
	var crawler = {
		bold: false,
		italic: false,
		text: '',
		element: null,
		runs: [],
		indents: [0], // start indents in points
		ibkt1: -1, // pos in text of [
		ibkt1c: -1, // pos in text of ]
		reset: function () {
			blockDepth = 0;
			doSilentOpen = false;
			silentOpenCounter = 0;
			this.bold = false;
			this.italic = false;
			this.text = '';
			this.runs = [];
			this.ibkt1 = -1;
			this.ibkt1c = -1;
			this.elemen = null;
		},
		format: function (bold2, italic2) {
			if (configSection) return;
			if (this.bold && !bold2 && this.italic) {
				// in case of   <b> xx <i> yy ^ </b> zz </i>
				// replace with <b> xx <i> yy </i> ^ </b> <i> zz </i>
				this.italic = false;
				outputText('</i>');
			}
			if (!this.bold && bold2) outputText('<b>');
			if (!this.italic && italic2) outputText('<i>');
			if (this.italic && !italic2) outputText('</i>');
			if (this.bold && !bold2) outputText('</b>');
			this.bold = bold2;
			this.italic = italic2;
		},
		applyIndent: function (textIndent) {
			var indents = this.indents;
			while (textIndent < indents[0]) {
				prevText = '';
				if (indents.length<=1) {
					throw "Indents broke! Are there negatives?"
				}
				if (silentOpenCounter>0) {
					silentOpenCounter--;
					evalExpr("end", null);
				}
				indents.shift();
				logcode("// applyIndent(" +textIndent+")-->"+indents.join())
			}
			if (textIndent > indents[0]) {
				prevText = '';
				indents.unshift(textIndent);
				if (doSilentOpen) {
					doSilentOpen = false;
					silentOpenCounter++;
					//evalExpr("silent{",null);
				}
				logcode("// applyIndent(" +textIndent+")++>"+indents.join())
			}
		},
		setupCrawler: function (textchild) {
			this.element = textchild;
			var text = this.text = textchild.getText();
			this.runs = textchild.getTextAttributeIndices();
			this.runs.push(text.length);
			var comment = text.indexOf('//');
			if (comment >= 0) this.text = text.substring(0, comment);
		},
		outputRun: function() {
			var i1 = this.runs[0];
			var i2 = this.runs[1];
			this.runs.shift();
			if (i2 <= i1) return;
			if (configSection) return;
			var s = this.text.substring(i1, i2);
			this.format(this.element.isBold(i2 - 1), this.element.isItalic(i2 - 1));
			outputText(s);
			if (options.applyFormat) {
				var sty = {};
				var row = blockDepth > 0 ? groupStyles[blockDepth * 2 % groupStyles.length] : groupStyleZero;
				// sty[DocumentApp.Attribute.BACKGROUND_COLOR] = row[2];
				sty[DocumentApp.Attribute.FOREGROUND_COLOR] = row[1];
				this.element.setAttributes(i1, i2 - 1, sty);
			}
		},
		onOpenBracket: function () {
			var text = this.text;
			var ibkt1 = this.ibkt1 = findUnescaped(text, '[', this.runs[0]);
			if (ibkt1 >= 0) {
				var ibkt1c = this.ibkt1c = findUnescaped(text, ']', ibkt1);
				var ibkt2 = findUnescaped(text, '[', ibkt1 + 1);
				if (ibkt1c < 0 || ibkt2 > 0 && ibkt2 < ibkt1c) {
					throw 'Encountered mismatched or complex bracket expression in ' +
					JSON.stringify(text.substring(0, 20)) + ': ' +
					'[ at ' + ibkt1 + (ibkt2 > 0 ? ' and ' + ibkt2 : '') + ', ] at ' + ibkt1c;
				}
			}
			return ibkt1 >= this.runs[0] && ibkt1 < this.runs[1];
		},
		expr: function () {
			return (this.ibkt1 >= 0 && this.ibkt1c > 0) ? this.text.substring(this.ibkt1 + 1, this.ibkt1c).trim() : null;
		},
		toString: function () {
			return JSON.stringify({
				expr: this.expr(),
				runs: this.runs,
				ibkt1: this.ibkt1,
				ibkt1c: this.ibkt1c,
				text: this.text.substring(this.runs[0], this.runs[1])
			});
		}
	};


	function as3(loc) {
		sources.push(tabs + loc);
		prevText = '';
		return sources.length-1;
	}
	function logcode(loc) {
		Logger.log(':'+sources.length+' <' +blockDepth+ '>\t'+loc);
	}
	function as3log(loc) {
		sources.push(tabs + loc);
		prevText = '';
		logcode(loc);
	}

	function indentPlus() {
		prevText = '';
		tabs += '\t';
	}

	function indentMinus() {
		prevText = '';
		tabs = tabs.substring(1);
	}

	function writeFileStart(filename, comment) {
		if (file) {
			writeFileEnd();
		}
		Logger.log('writeFileStart(' + JSON.stringify(filename) + ')');
		tabs = '';
		as3('// Start of file "' + filename + '"');
		as3('// GENERATED CODE - MANUAL CHANGES MAY BE OVERWRITTEN');
		as3('// Generated by Lewd Writer\'s Assistant for Google Docs');
		as3('// Source: ' + (doc.getUrl() || doc.getId()));
		var path = filename.split('/');
		path.unshift('Scenes');
		path.unshift('classes');
		var classname = identifier(path.pop().replace('.as', ''));
		file = {
			name: name,
			path: path,
			classname: classname,
			superclass: 'BaseContent',
			lineno: -1
		};
		as3('package ' + path.join('.') + ' {');
		as3('');
		as3('import classes.*');
		as3('');
		if (comment) writeComment(comment);
		file.lineno = as3('public class ' + file.classname + ' extends ' + file.superclass + ' {');
		indentPlus();
	}
	function setSuperclass(superclass) {
		file.superclass = superclass;
		var loc  = 'public class ' + file.classname + ' extends ' + file.superclass + ' {';
		sources[file.lineno] = loc;
		Logger.log(':'+file.lineno+' <0>\t'+loc);
	}
	function configSectionStart() {
		if (configSection) configSectionEnd();
		if (method) writeMethodEnd();
		Logger.log('configSectionStart()');
		configSection = {};
	}
	function configSectionEnd() {
		Logger.log('configSectionEnd()');
		configSection = null;
	}

	function writeMethodStart(methodname, comment) {
		if (method) writeMethodEnd('');
		if (configSection) configSectionEnd();
		Logger.log('writeMethodStart(' + JSON.stringify(methodname) + ')');
		method = {
			name: name,
			buttons: [],
			returns: false
		};
		crawler.reset();
		as3('');
		if (comment) writeComment(comment);
		as3('public function ' + methodname + '():void {');
		indentPlus();
		as3('clearOutput();');
		as3('menu();');
	}

	function outputTextImpl(text) {
		as3('outputText(' + JSON.stringify(text) + ');');
	}

	function writeComment(comment) {
		as3('// ' + comment);
	}

	function outputText(text) {
		if (!text) return;
		if (prevText && sources) {
			sources.pop();
			text = prevText + text;
			// sources = [ ... output( prevText ) ], text = prevText + newText
			var inn = text.indexOf('\n\n', 2);
			if (inn > 0) {
				outputTextImpl(text.substring(0, inn));
				text = text.substring(inn);
				// sources = [ ... output( fullText before \n\n ) ], text = fullText from \n\n
			}
		}
		outputTextImpl(text);
		prevText = text;
	}

	function writeMethodEnd(comment) {
		if (blockDepth > 0) {
			throw "Unterminated block";
		}
		if (!method.returns) {
			throw "No [continue ...], [camp], [next ...], or [choice ...] tags"
		}
		if (comment) writeComment(comment);
		Logger.log('writeMethodEnd()');
		indentMinus();
		as3('}');
		method = null;
	}

	function writeFileEnd(comment) {
		if (comment) writeComment(comment);
		if (method) writeMethodEnd('');
		if (configSection) configSectionEnd();
		Logger.log('writeFileEnd()');
		indentMinus();
		as3('}');
		as3('}');
		as3('// End of file "' + file.name + '"');
		file = null;
	}

	function evalExpr(expr, crawler) {
		if (prevText == '\n') {
			prevText = '';
			sources.pop();
		}
		doSilentOpen = false;
		var argv = expr.split(/\s+/);
		var cmd = argv[0].toLowerCase();
		var arg1str = expr.substr(cmd.length).replace(/^\s+/,'');
		var myDepth = blockDepth*2;
		var myBold = false;
		var myFont = null;
		var i,n,s,name;
		if (configSection) {
			myBold = true;
			myFont = 'Consolas';
			switch (cmd) {
				case 'extends':
					setSuperclass(identifier(arg1str));
					break;
				case 'require':
					if (argv.length<3) throw "Incorrect [require] syntax"
					name = identifier(arg1str.substr(argv[1].length));
					s = 'override public function ';
					var rt;
					switch (argv[1].toLowerCase()) {
						case 'flag':
						case 'number':
							rt = 'Number';
							break;
						case 'text':
							rt = 'String;'
							break;
						case 'action':
							rt = 'void';
							break;
						default:
							throw "Incorrect [require] type"
					}
					s += (rt == 'void'?'':'get ')+name+'():'+rt+' {';
					as3log(s);
					indentPlus();
					if (rt == 'void') {
						as3log('super.'+name+'();');
					} else {
						as3log('return super.'+name+';');
					}
					indentMinus();
					as3log('}');
					break;
				default:
					throw "Unknown config command "+cmd;
			}
		} else {
			switch (cmd) {
				case 'if':
					if (arg1str[0] == '(') {
						outputTextImpl('[' + expr + ']');
						logcode('// ...[' + expr + ']...');
						myBold = undefined;
						break;
					}
					as3log('if (' + identifier(arg1str, REX_EXPR) + ') {');
					blockDepth++;
					myDepth++;
					indentPlus();
					doSilentOpen = true;
					break;
				case 'silent{':
					indentPlus();
					blockDepth++;
					myDepth++;
					logcode('// silent{');
					if (blockDepth < 0) throw "Unexpected [silent{]-tag"
					break;
				case 'silent}':
				case 'end':
					indentMinus();
					blockDepth--;
					myDepth--;
					if (cmd == 'end') {
						as3log('}');
					} else {
						logcode('// silent}')
					}
					if (blockDepth < 0) throw "Unexpected [" + cmd + "]-tag"
					break;
				case 'else':
					indentMinus();
					myDepth--;
					if (argv.length == 1) {
						as3log('} else {');
					} else {
						if (arg1str.substring(0, 2).toLowerCase() != 'if') throw 'Incorrect else expression ' + JSON.stringify(expr);
						as3log('} else if (' + identifier(arg1str.substring(2), REX_EXPR) + ') {');
					}
					indentPlus();
					break;
				case 'choice':
					myBold = true;
					var btnidx = +(argv[1]);
					if (!isFinite(btnidx)) {
						for (btnidx = 0; btnidx < 15 && method.buttons[btnidx]; btnidx++) {}
						if (btnidx >= 15) throw "Too many choices! Add explicit button positions";
					} else {
						arg1str = arg1str.substring(argv[1].length).trim();
					}
					method.buttons[btnidx] = true;
					var closer = '';
					switch (arg1str[0]) {
						case '“':
							closer = '”';
							break;
						case '‘':
							closer = '’';
							break;
						case '"':
							closer = '"';
							break;
						case "'":
							closer = "'";
							break;
					}
					var btntxt = "Choice " + (btnidx + 1);
					if (closer) {
						i = arg1str.indexOf(closer, 1);
						if (i < 0) throw "Missing closing " + closer;
						btntxt = arg1str.substring(1, i);
						arg1str = arg1str.substring(i + 1);
					} else {
						btntxt = arg1str.split('/\s+/').map(function (e) {return cap1(e);}).join(' ');
					}
					var btnfn = identifier(arg1str, REX_SIMPLE_EXPR);
					if (!btnfn) throw "Missing or invalid button function";
					as3log('addButton(' + btnidx + ', ' + JSON.stringify(btntxt) + ', ' + btnfn + ');');
					method.returns = true;
					break;
				case 'do':
					myBold = true;
					var s = identifier(arg1str, REX_EXPR);
					if (!s) throw "Missing expression";
					if (s.indexOf('(') < 0) s += '()';
					as3log(s + ';');
					break;
				case 'next':
					myBold = true;
					as3log('doNext(' + identifier(arg1str, REX_SIMPLE_EXPR) + ');');
					method.returns = true;
					break;
				case 'camp':
					myBold = true;
					as3log('doNext(camp.returnToCampUseOneHour);');
					method.returns = true;
					break;
				case 'continue':
					myBold = true;
					as3log(identifier(arg1str, REX_SIMPLE_EXPR) + '();');
					method.returns = true;
					break;
				default:
					outputTextImpl('[' + expr + ']');
					logcode('...[' + expr + ']...');
					myBold = undefined;
			}
		}
		if (crawler && options.applyFormat) {
			var sty = {};
			var row = myDepth > 0 ? groupStyles[myDepth % groupStyles.length] : groupStyleZero;
			sty[DocumentApp.Attribute.FOREGROUND_COLOR] = row[1];
			if (myBold !== undefined) sty[DocumentApp.Attribute.BOLD] = myBold;
			sty[DocumentApp.Attribute.FONT_FAMILY] = myFont;
			//sty[DocumentApp.Attribute.BACKGROUND_COLOR] = row[1];
			crawler.element.setAttributes(crawler.ibkt1, crawler.ibkt1c, sty);
		}
	}

	function parseParagraph(par, gtext, gcomment) {
		crawler.applyIndent(Math.max(par.getIndentStart(),par.getIndentFirstLine()));
		if (configSection) {
			if (gcomment) writeComment(gcomment);
		}
		for (var ci = 0, cn = par.getNumChildren(); ci < cn; ci++) {
			var c = par.getChild(ci).asText();
			if (!c) continue;
			crawler.setupCrawler(c);
			while (crawler.runs.length > 1) {
				while (crawler.onOpenBracket()) {
					// [ xxx '[' yyy ] => [ xxx ] [ '[' yyy ]
					crawler.runs.unshift(crawler.runs[0]);
					crawler.runs[1] = crawler.ibkt1;
					crawler.outputRun();
					crawler.format(false, false);
					while (crawler.ibkt1c >= crawler.runs[1]) {
						if (crawler.runs.length <= 2) throw 'Parser broke! crawler=' + crawler.toString();
						crawler.runs[1] = crawler.runs[0];
						crawler.runs.shift();
					}
					crawler.runs[0] = crawler.ibkt1c + 1;
					// Logger.log(crawler.toString());
					evalExpr(crawler.expr(), crawler);
				}
				crawler.outputRun();
			}
		}
		if (!!method) {
			crawler.format(false, false);
			outputText('\n');
			if (gcomment) writeComment(gcomment);
		}

	}

	var doc = DocumentApp.getActiveDocument();
	var body = doc.getBody();

	var i, n, name;
	for (i = 0, n = body.getNumChildren(); i < n; i++) {
		if (body.getChild(i).getType() != DocumentApp.ElementType.PARAGRAPH) continue;
		var par = body.getChild(i).asParagraph();
		var tc = uncomment(par.getText());
		var text = tc[0], comment = tc[1];
		try {
			switch (par.getHeading()) {
				case DocumentApp.ParagraphHeading.TITLE:
				case DocumentApp.ParagraphHeading.SUBTITLE:
				case DocumentApp.ParagraphHeading.HEADING1:
					if (file) writeFileEnd(comment);
					break;
				case DocumentApp.ParagraphHeading.HEADING2:
					name = strip(text, /[^a-zA-Z0-9_$\/\.]/g);
					if (file) writeFileEnd('');
					if (!name.match(/.+\.as$/)) {
						Logger.log('Skipping H2 ' + JSON.stringify(text));
						break;
					}
					writeFileStart(name, comment);
					break;
				case DocumentApp.ParagraphHeading.HEADING3:
				case DocumentApp.ParagraphHeading.HEADING4:
				case DocumentApp.ParagraphHeading.HEADING5:
					if (!file) break;
					if (strip(text) == '(config)') {
						configSectionStart();
						break;
					}
					name = cap0(identifier(text));
					if (!name) {
						Logger.log('Skipping H3-5 ' + JSON.stringify(text));
						break;
					}
					writeMethodStart(name, comment);
					break;
				case DocumentApp.ParagraphHeading.NORMAL:
					if (method || configSection) {
						parseParagraph(par, text, comment);
					}
					break;
				default:
					Logger.log('Illegal ParagraphHeading: ' + par.getHeading());
					break;
			}
		} catch (e) {
			var rangeBuilder = doc.newRange();
			rangeBuilder.addElement(par);
			doc.setSelection(rangeBuilder.build());
			throw e;
		}
	}
	if (configSection) configSectionEnd();
	if (method) writeMethodEnd();
	if (file) writeFileEnd();
	as3('');
	result.as3 = sources;
	return result;
}

