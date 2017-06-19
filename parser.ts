/*
 * Created by aimozg on 18.06.2017.
 * Confidential until published on GitHub
 */

function parseDocument(doc: Document): TFile[] {
	Logger.log("parseDocument()");
	let N: number;
	let DATA = [] as PParagraph[];
	
	interface PParagraph {
		par: Paragraph;
		text: string;
		comment: string;
	}
	
	function parseFile(I: number): [number, TFile] {
		let p0   = DATA[I++];
		let name = strip(p0.text, /[^a-zA-Z0-9_$\/\.]/g);
		if (!name.match(/.+\.as$/)) {
			Logger.log('Skipping H2 ' + JSON.stringify(p0.text));
			return [I, null];
		}
		Logger.log('parseFile(' + JSON.stringify(name) + ')');
		const path = name.split('/');
		path.unshift('Scenes');
		path.unshift('classes');
		const classname = identifier(path.pop().replace('.as', ''));
		let file        = {
			name      : name,
			path      : path,
			classname : classname,
			superclass: 'BaseContent',
			comment   : p0.comment,
			config    : null,
			methods   : [],
			document  : doc
		} as TFile;
		let end         = false;
		while (I < N && !end) {
			let {par, text, comment} = DATA[I];
			switch (par.getHeading()) {
				case DocumentApp.ParagraphHeading.TITLE:
				case DocumentApp.ParagraphHeading.SUBTITLE:
				case DocumentApp.ParagraphHeading.HEADING1:
				case DocumentApp.ParagraphHeading.HEADING2:
					end = true;
					break;
				case DocumentApp.ParagraphHeading.HEADING3:
				case DocumentApp.ParagraphHeading.HEADING4:
				case DocumentApp.ParagraphHeading.HEADING5:
					if (strip(text) === '(config)') {
						[I, file.config] = parseConfig(I, file);
					} else {
						let method;
						[I, method] = parseMethod(I, file);
						if (method) file.methods.push(method);
					}
					break;
				case DocumentApp.ParagraphHeading.NORMAL:
					if (text) file.comment += '\n' + text;
					if (comment) file.comment += ' // ' + comment;
					I++;
					break;
				default:
					Logger.log('Illegal ParagraphHeading: ' + par.getHeading());
					I++;
			}
		}
		file.comment = file.comment.trim();
		Logger.log("END of parseFile()");
		return [I, file];
	}
	
	function parseConfig(I: number, file: TFile): [number, TConfigSection] {
		let p0 = DATA[I++];
		Logger.log('parseConfig()');
		let config = {
			file   : file,
			comment: p0.comment
		};
		let end    = false;
		while (I < N && !end) {
			let par = DATA[I].par;
			switch (par.getHeading()) {
				case DocumentApp.ParagraphHeading.TITLE:
				case DocumentApp.ParagraphHeading.SUBTITLE:
				case DocumentApp.ParagraphHeading.HEADING1:
				case DocumentApp.ParagraphHeading.HEADING2:
				case DocumentApp.ParagraphHeading.HEADING3:
				case DocumentApp.ParagraphHeading.HEADING4:
				case DocumentApp.ParagraphHeading.HEADING5:
					end = true;
					break;
				case DocumentApp.ParagraphHeading.NORMAL:
					I = parseConfigStatement(I, config);
					break;
				default:
					Logger.log('Illegal ParagraphHeading: ' + par.getHeading());
					I++;
			}
		}
		Logger.log('END of parseConfig()');
		return [I, config];
	}
	
	function parseConfigStatement(I: number, config: TConfigSection): number {
		// todo config statement
		I++;
		return I;
	}
	
	/*
	 interface Crawler {
	 // context
	 blockDepth: 0;
	 text: string;
	 element: Text;
	 indents: number[]; // start indents in points
	 // text-related
	 bold: boolean;
	 italic: boolean;
	 output: string;
	 runs: number[];
	 ibkt1: number; // pos in text of [
	 ibkt1c: number; // pos in text of ]
	 }
	 function applyIndent(textIndent: number): void {
	 const indents = this.indents;
	 while (textIndent < indents[0]) {
	 prevText = '';
	 if (indents.length <= 1) {
	 throw "Indents broke! Are there negatives?"
	 }
	 if (silentOpenCounter > 0) {
	 silentOpenCounter--;
	 evalExpr("end", null);
	 }
	 indents.shift();
	 logcode("// applyIndent(" + textIndent + ")-->" + indents.join())
	 }
	 if (textIndent > indents[0]) {
	 prevText = '';
	 indents.unshift(textIndent);
	 if (doSilentOpen) {
	 doSilentOpen = false;
	 silentOpenCounter++;
	 //evalExpr("silent{",null);
	 }
	 logcode("// applyIndent(" + textIndent + ")++>" + indents.join())
	 }
	 }
	 function outputFormat(crawler: Crawler, bold2: boolean, italic2: boolean): void {
	 if (crawler.bold && !bold2 && crawler.italic) {
	 // in case of   <b> xx <i> yy ^ </b> zz </i>
	 // replace with <b> xx <i> yy </i> ^ </b> <i> zz </i>
	 crawler.italic = false;
	 crawler.output += '</i>';
	 }
	 if (!crawler.bold && bold2) crawler.output += '<b>';
	 if (!crawler.italic && italic2) crawler.output += '<i>';
	 if (crawler.italic && !italic2) crawler.output += '</i>';
	 if (crawler.bold && !bold2) crawler.output += '</b>';
	 crawler.bold   = bold2;
	 crawler.italic = italic2;
	 }
	 
	 
	 const crawler: Crawler = {
	 blockDepth: 0,
	 bold      : false,
	 italic    : false,
	 text      : '',
	 output    : '',
	 element   : null,
	 runs      : [],
	 indents   : [0], // start indents in points
	 ibkt1     : -1, // pos in text of [
	 ibkt1c    : -1, // pos in text of ]
	 };
	 
	 const crawler = {
	 outputRun    : function (configSection:TConfigSection): void {
	 const i1 = this.runs[0];
	 const i2 = this.runs[1];
	 this.runs.shift();
	 if (i2 <= i1) return;
	 if (configSection) return;
	 const s = this.text.substring(i1, i2);
	 this.format(this.element.isBold(i2 - 1), this.element.isItalic(i2 - 1),configSection);
	 outputText(s);
	 if (options.applyFormat) {
	 const sty                                   = {};
	 const row                                   = blockDepth > 0 ? GroupStyles[blockDepth * 2 % GroupStyles.length] : GroupStyleZero;
	 // sty[DocumentApp.Attribute.BACKGROUND_COLOR] = row[2];
	 sty[DocumentApp.Attribute.FOREGROUND_COLOR] = row[1];
	 this.element.setAttributes(i1, i2 - 1, sty);
	 }
	 },
	 expr         : function (): string {
	 return (this.ibkt1 >= 0 && this.ibkt1c > 0) ? this.text.substring(this.ibkt1 + 1, this.ibkt1c).trim() : null;
	 }
	 };
	 
	 function evalExpr(expr: string, crawler: Crawler): void {
	 if (prevText === '\n') {
	 prevText = '';
	 sources.pop();
	 }
	 doSilentOpen = false;
	 const argv   = expr.split(/\s+/);
	 const cmd    = argv[0].toLowerCase();
	 let arg1str  = expr.substr(cmd.length).replace(/^\s+/, '');
	 let myDepth  = blockDepth * 2;
	 let myBold   = false;
	 let myFont   = null;
	 let i, n, s, name;
	 if (configSection) {
	 myBold = true;
	 myFont = 'Consolas';
	 switch (cmd) {
	 case 'extends':
	 setSuperclass(identifier(arg1str));
	 break;
	 case 'require':
	 if (argv.length < 3) throw "Incorrect [require] syntax";
	 name = identifier(arg1str.substr(argv[1].length));
	 s    = 'override public function ';
	 let rt;
	 switch (argv[1].toLowerCase()) {
	 case 'flag':
	 case 'number':
	 rt = 'Number';
	 break;
	 case 'text':
	 rt = 'String;';
	 break;
	 case 'action':
	 rt = 'void';
	 break;
	 default:
	 throw "Incorrect [require] type"
	 }
	 s += (rt === 'void' ? '' : 'get ') + name + '():' + rt + ' {';
	 as3log(s);
	 indentPlus();
	 if (rt === 'void') {
	 as3log('super.' + name + '();');
	 } else {
	 as3log('return super.' + name + ';');
	 }
	 indentMinus();
	 as3log('}');
	 break;
	 default:
	 throw "Unknown config command " + cmd;
	 }
	 }
	 if (crawler && options.applyFormat) {
	 const sty = {};
	 const row = myDepth > 0 ? GroupStyles[myDepth % GroupStyles.length] : GroupStyleZero;
	 
	 sty[DocumentApp.Attribute.FOREGROUND_COLOR] = row[1];
	 if (myBold !== undefined) sty[DocumentApp.Attribute.BOLD] = myBold;
	 sty[DocumentApp.Attribute.FONT_FAMILY] = myFont;
	 //sty[DocumentApp.Attribute.BACKGROUND_COLOR] = row[1];
	 crawler.element.setAttributes(crawler.ibkt1, crawler.ibkt1c, sty);
	 }
	 }
	 
	 */
	function parseParagraph(parts: TTextRun[], method: TMethod, par: Paragraph): void {
		for (let ci = 0, cn = par.getNumChildren(); ci < cn; ci++) {
			let c = par.getChild(ci).asText();
			if (!c) continue;
			let runs = c.getTextAttributeIndices();
			let text = c.getText();
			runs.push(text.length);
			let comment = text.indexOf('//');
			if (comment >= 0) text = text.substring(0, comment);
			let open = findUnescaped(text, '[');
			if (open >= 0) Logger.log("Splitting text to runs "+JSON.stringify(runs)+" with first '[' at "+open);
			while (runs.length > 1) {
				if (comment >= 0 && runs[0] >= comment) break;
				if (comment >= 0 && runs[1] > comment) runs[1] = comment;
				if (open>=0 && open < runs[1]) {
					let close: number;
					close      = findUnescaped(text, ']', open);
					let open2 = findUnescaped(text, '[', open + 1);
					if (close < 0 || open2 > 0 && open2 < close) {
						throw 'Encountered mismatched or complex bracket expression in ' +
							  JSON.stringify(text.substring(0, 20)) + ': ' +
							  '[ at ' + open + (open2 > 0 ? ' and ' + open2 : '') + ', ] at ' + close;
					}
					if (runs[0] < open) {
						// [ xxx '[' yyy ] => [ xxx ] [ '[' yyy ]
						runs.unshift(runs[0]);
						runs[1] = open;
					} else {
						while (close >= runs[1]) {
							// [ '[' yyy ] [ zzz ']' www ] => [ '[' yyy zzz ']' www ]
							if (runs.length <= 2) throw 'Parser broke! ' + JSON.stringify({
								runs, open, close, text: text.substring(runs[0], runs[1])
							});
							runs[1] = runs[0];
							runs.shift();
						}
						open = open2;
						if (close + 1 < runs[1]) {
							// [ '[' yyy zzz ']' www ] => [ '[' yyy zzz ']' ] [ www ]
							runs.unshift(runs[0]);
							runs[1] = close+1;
						}
					}
				}
				if (runs.length < 2) throw 'Parser broke! ' + JSON.stringify({
					runs, open, text: text.substring(runs[0], runs[1])
				});
				const i1 = runs[0];
				const i2 = runs[1];
				runs.shift();
				if (i2 > i1) {
					let p ={
						par, element: c, i1: i1, i2: i2,
						text        : text.substring(i1, i2),
						bold        : c.isBold(i2 - 1),
						italic      : c.isItalic(i2 - 1)
					};
					//Logger.log(TTextRun.toString(p)); // todo if verbose
					parts.push(p);
				}
			}
			if (comment >= 0) {
				text = c.getText();
				let p = {
					par, element: c,
					i1          : comment, i2: text.length,
					text        : text.substring(comment),
					bold        : c.isBold(comment),
					italic      : c.isItalic(comment)
				};
				//Logger.log(TTextRun.toString(p));
				parts.push(p);
			}
		}
		if (parts.length > 0 && parts[parts.length-1].text[0]!='[') parts[parts.length - 1].text += '\n';
	}
	
	function parseMethod(I: number, file: TFile): [number, TMethod] {
		let p0         = DATA[I++];
		let methodname = cap0(identifier(p0.text));
		if (!methodname) {
			Logger.log('Skipping H3-5 ' + JSON.stringify(p0.text));
			return [I, null];
		}
		Logger.log('parseMethod(' + JSON.stringify(methodname) + ')');
		let method = {
			name      : methodname,
			buttons   : [],
			returns   : false,
			comment   : p0.comment,
			file      : file,
			statements: []
		} as TMethod;
		let BTNIDX = 0;
		let PARTS  = [] as TTextRun[];
		while (I < N) {
			let par = DATA[I].par;
			if (par.getHeading() != DocumentApp.ParagraphHeading.NORMAL) {
				break;
			}
			// TODO indent?
			parseParagraph(PARTS, method, par);
			I++;
		}
		method.comment = method.comment.trim();
		let M          = PARTS.length;
		Logger.log("Found " + M + " text part(s)");
		if (M>0) Logger.log("Last one is "+PARTS[M-1].i1+":"+PARTS[M-1].i2+" "+JSON.stringify(PARTS[M-1].text));
		
		function reserveButton(btnidx: number): number {
			method.buttons[btnidx] = true;
			while (method.buttons[BTNIDX]) BTNIDX++;
			return btnidx;
		}
		
		function matchStringLiteral(s: string): RegExpMatchArray {
			return s.match(/^“([^”]*)”\s*/) ||
				   s.match(/^‘([^’]*)’\s*/) ||
				   s.match(/^"([^"]*)"\s*/) ||
				   s.match(/^'([^']*)'\s*/);
		}
		
		function extractTagWithRest(s: string): [string, string] {
			let match;
			if ((match = s.match(/^\[\s*([\w\-_$]+)\s*(.*)\]\s*$/))) {
				return [match[1].toLowerCase(), match[2]];
			}
			return ['', ''];
		}
		
		function parseUntil(J: number, dst: TStatement[], until: EStopFlag[]): [number, string | null, string | null] {
			let prev: TStatement = null;
			while (J < M) {
				let stmt:TStatement;
				if (until.indexOf('indent') >= 0 && prev) {
					let myIndent   = findIndent(PARTS[J]);
					let prevIndent = findIndent(prev.run);
					if (myIndent < prevIndent) {
						return [J, 'indent', null];
					}
				}
				[J, stmt] = parseStatement(J, (prev && prev.type == 'text') ? prev : null, until);
				
				if (stmt) {
					Logger.log(stmt.type+' '+JSON.stringify(stmt.run?stmt.run.text.substr(0,10):null));
					dst.push(stmt);
					prev = stmt;
				} else {
					if (J < M) {
						let run = PARTS[J];
						let tr  = extractTagWithRest(run.text);
						return [J, tr[0], tr[1]];
					}
				}
			}
			Logger.log("Saved "+dst.length+" statement(s)");
			return [J, null, null];
		}
		
		function parseIfStatement(J: number, ifstmt: StmtIf, indentBreak: boolean): [number, StmtIf] {
			Logger.log("Parsing [if]");
			let indent = findIndent(ifstmt.run);
			let run, tag, rest;
			
			[J, tag, rest] = parseUntil(J, ifstmt.thenBlock,
				indentBreak ? ['indent', 'end', 'elseif', 'else'] : ['end', 'elseif', 'else']);
			Logger.log("then-block hit [" + tag + ' ' + rest + "] after " + (ifstmt.thenBlock.length) + " statement(s)");
			run = PARTS[J++];
			switch (tag) {
				case 'end':
					ifstmt.endRun = run;
					return [J, ifstmt];
				case 'indent':
					return [J, ifstmt];
				case 'else':
					if (rest.substring(0, 2).toLowerCase() == 'if') {
						let expr = identifier(rest.substring(2), REX_EXPR);
						if (!expr) throw "Missing or invalid [else if] expression";
						ifstmt.elseIfBlock = {
							type       : 'if',
							run        : run,
							condition  : expr,
							thenBlock  : [],
							elseBlock  : null,
							elseIfBlock: null,
						} as StmtIf;
						Logger.log("adding [else if]:");
						[J, ifstmt.elseIfBlock] = parseIfStatement(J, ifstmt.elseIfBlock, false);
						return [J, ifstmt];
					} else {
						if (rest.trim()) throw "Incorrect [else] (not empty, not [else if])";
						ifstmt.elseRun = run;
						ifstmt.elseBlock = [];
						Logger.log("adding [else]:");
						[J, tag] = parseUntil(J, ifstmt.elseBlock, ['end']);
						if (tag !== 'end') {
							throw "Unexpected end of input"
						}
						ifstmt.endRun = PARTS[J];
						Logger.log("else-block hit [end] after " + (ifstmt.elseBlock.length) + " statement(s)");
						J++;
						return [J, ifstmt];
					}
				case 'elseif':
					let expr = identifier(rest, REX_EXPR);
					if (!expr) throw "Missing or invalid [if] expression";
					ifstmt.elseIfBlock = {
						type       : 'if',
						run        : run,
						condition  : expr,
						thenBlock  : [],
						elseBlock  : null,
						elseIfBlock: null,
					} as StmtIf;
					Logger.log("adding [elseif]:");
					[J, ifstmt.elseIfBlock] = parseIfStatement(J, ifstmt.elseIfBlock, false);
					return [J, ifstmt];
				default:
					throw "Unexpected end of input; " + tag;
			}
		}
		
		type EStopFlag = 'end' | 'else' | 'elseif' | 'indent';
		function parseStatement(J: number, prev: StmtText, stop: EStopFlag[]): [number, TStatement | null] {
			let run = PARTS[J++];
			//Logger.log(" "+TTextRun.toString(run)); // todo if verbose
			let match;
			if ((match = run.text.match(/^\s*\/\/(.*)/))) {
				Logger.log('//comment: ' + JSON.stringify(match[1].substring(0, 20)));
				return [J, {
					type   : 'comment',
					comment: match[1],
					run    : run
				}];
			} else if (run.text[0] === '[') {
				let [tagname, rest] = extractTagWithRest(run.text);
				if (tagname) {
					let argid = identifier(rest);
					Logger.log("[" + tagname + "]");
					switch (tagname) {
						case 'end':
						case 'elseif':
						case 'else':
							if (stop.indexOf(tagname) >= 0) {
								return [J - 1, null];
							} else {
								// todo select line
								throw "Mismatched [" + tagname + "]";
							}
						case 'choice':
							method.returns = true;
							let btnidx: number;
							if ((match = rest.match(/^(\d+)\s*/))) {
								btnidx = reserveButton((+match[1]) + 1);
								rest   = rest.substr(match[0].length);
							} else {
								btnidx = reserveButton(BTNIDX);
							}
							let btntxt: string = null;
							if (match = matchStringLiteral(rest)) {
								btntxt = match[1];
								rest   = rest.substr(match[0].length);
							} else if ('“‘"\''.indexOf(rest[0]) >= 0) {
								// todo select line
								throw "Missing closing quotes"
							}
							let btnfn = identifier(rest, REX_SIMPLE_EXPR);
							if (!btnfn) throw "Missing or invalid [button] function or expression";
							if (btntxt === null) btntxt = capX(rest.trim(), 0, ' ');
							return [J, {
								type  : 'button',
								label : btntxt,
								idx   : btnidx,
								action: btnfn,
								run   : run
							}];
						case 'do':
							method.returns = true;
							let expr       = identifier(rest, REX_EXPR);
							if (!expr) throw "Missing or invalid [do] expression";
							if (expr.indexOf('(') < 0) expr += '()';
							return [J, {
								type  : 'exec',
								action: expr,
								run   : run
							}];
						case 'continue':
							method.returns = true;
							if (!argid) throw "Missing or invalid [continue] function";
							return [J, {
								type  : 'call',
								action: argid,
								run   : run
							}];
						case 'next':
							method.returns = true;
							if (!argid) throw "Missing or invalid [next] function";
							return [J, {
								type  : 'button',
								label : 'Next',
								idx   : reserveButton(BTNIDX),
								action: argid,
								run   : run
							}];
						case 'camp':
							method.returns = true;
							match          = matchStringLiteral(rest);
							return [J, {
								type  : 'button',
								label : match ? match[1] : 'Next',
								idx   : reserveButton(BTNIDX),
								action: 'camp.returnToCampUseOneHour',
								run   : run
							}];
						case 'if': {
							if (rest[0] === '(') {
								return [J, {
									type: 'tag',
									text: run.text,
									run : run
								}];
							}
							let expr = identifier(rest, REX_EXPR);
							if (!expr) throw "Missing or invalid [if] expression";
							let ifstmt = {
								type       : 'if',
								run        : run,
								condition  : expr,
								thenBlock  : [],
								elseBlock  : null,
								elseIfBlock: null,
							} as StmtIf;
							return parseIfStatement(J, ifstmt, true);
						}
					}
				}
				Logger.log("Not a special tag " + JSON.stringify(run.text));
				return [J, {
					type: 'tag',
					text: run.text,
					run : run
				}];
			} else {
				return [J, {
					type: 'text',
					text: run.text,
					run : run
				}];
			}
		}
		
		let j = 0;
		parseUntil(0, method.statements, []);
		/*
		 if (crawler.blockDepth > 0) {
		 // todo select block
		 // doc.setSelection(doc.newRange().addElement(par).build());
		 throw "Unterminated block";
		 }
		 if (!method.returns) {
		 // todo select prev element
		 // doc.setSelection(doc.newRange().addElement(par).build());
		 throw "No [continue ...], [camp], [next ...], or [choice ...] tags"
		 }
		 */
		Logger.log("END of parseMethod()");
		return [I, method];
	}
	
	const body = doc.getBody();
	let files  = [] as TFile[];
	
	for (let i = 0, n = body.getNumChildren(); i < n; i++) {
		if (body.getChild(i).getType() !== DocumentApp.ElementType.PARAGRAPH) continue;
		let par             = body.getChild(i).asParagraph();
		let [text, comment] = uncomment(par.getText());
		DATA.push({par, text, comment});
	}
	N = DATA.length;
	Logger.log("Found " + N + " paragraph(s)");
	for (let I = 0; I < N;) {
		if (DATA[I].par.getHeading() == DocumentApp.ParagraphHeading.HEADING2) {
			let file: TFile;
			[I, file] = parseFile(I);
			if (file) files.push(file);
		} else {
			I++;
		}
	}
	Logger.log("END of parseDocument()");
	return files;
}


