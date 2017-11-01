/*
 * Created by aimozg on 18.06.2017.
 * Confidential until published on GitHub
 */

function traceElement(depth: number, e: Element): void {
	function attrstr(attrs: any): string {
		let text = JSON.stringify(attrs);
		text     = text.replace(/"\w+":(null|\{\})/g, '');
		text     = text.replace(/"LEFT_TO_RIGHT":true/g, '');
		text     = text.replace(/,+}/g, '}');
		text     = text.replace(/\{,+/g, '{');
		text     = text.replace(/,+"/g, ', "');
		return text;
	}
	
	const TEXT  = 80;
	const NODES = 100;
	let indent  = '';
	for (let i = 0; i < depth; i++) indent += '\t';
	
	const type = e.getType();
	let s      = indent;
	s += ' type=' + type;
	
	let text = attrstr(e.getAttributes());
	if (text !== '{}') s += ' attrs=' + text;
	
	if (type === DocumentApp.ElementType.PARAGRAPH) {
		let p         = e as Paragraph;
		const heading = p.getHeading();
		s += ' level=' + heading;
		s += ' indent=' + Math.max(p.getIndentStart(), p.getIndentFirstLine());
	}
	Logger.log(s);
	
	if (type === DocumentApp.ElementType.TEXT) {
		let t      = e as Text;
		const runs = t.getTextAttributeIndices();
		text       = t.getText();
		for (let i = 0; i < runs.length; i++) {
			const i1 = runs[i];
			const i2 = (i + 1 === runs.length) ? t.getText().length : runs[i + 1];
			s        = indent + '\t' + i1 + '..' + i2 + ': ';
			
			let subtext = attrstr(t.getAttributes(i1));
			if (subtext !== '{}') s += ' attrs=' + subtext;
			
			subtext = text.substring(i1, i2);
			s += ' text=' + JSON.stringify(subtext.slice(0, TEXT));
			if (subtext.length > TEXT) s += '...[' + subtext.length + ']';
			
			Logger.log(s);
		}
	}
	
	if ('getNumChildren' in e) {
		let c = e as ContainerElement;
		let n = c.getNumChildren();
		if (n > 0) {
			let i;
			for (i = 0; i < n && i < NODES / 2; i++) {
				traceElement(depth + 1, c.getChild(i));
			}
			if (n > NODES) {
				Logger.log(indent + '\t... (' + (n - NODES) + ' more)');
			}
			if (i + NODES / 2 < n) i = n - NODES / 2;
			for (; i < n; i++) {
				traceElement(depth + 1, c.getChild(i));
			}
		}
	}
}

function applyStyle(run:TTextRun, style:{
	fg?:string,
	bg?:string,
	bold?:boolean,
	italic?:boolean,
	face?:string
}) {
	let sty:any = {};
	if ('fg' in style && style.fg !== null) sty[DocumentApp.Attribute.FOREGROUND_COLOR] = style.fg;
	if ('bg' in style && style.bg !== null) sty[DocumentApp.Attribute.BACKGROUND_COLOR] = style.bg;
	if ('bold' in style && style.bold !== null) sty[DocumentApp.Attribute.BOLD] = ''+style.bold;
	if ('italic' in style && style.italic !== null) sty[DocumentApp.Attribute.ITALIC] = ''+style.italic;
	if ('face' in style && style.face !== null) sty[DocumentApp.Attribute.FONT_FAMILY] = style.face;
	run.element.setAttributes(run.i1,run.i2-1,sty);
}
function debugDom(): { logs: string } {
	Logger.clear();
	traceElement(0, DocumentApp.getActiveDocument().getBody());
	return {
		logs: Logger.getLog()
	}
}
function cap1(s: string): string {
	return s.substr(0, 1).toUpperCase() + s.substr(1);
}
function cap0(s: string): string {
	return s.substr(0, 1).toLowerCase() + s.substr(1);
}
function capX(s: string, firstCap: number,joiner:string='', splitter: RegExp=/\s+/):string {
	return s.split(splitter).map((s,i)=>(i>=firstCap?cap1(s):cap0(s))).join(joiner);
}
function uncomment(s: string): [string, string] {
	const i = s.indexOf('//');
	if (i >= 0) return [s.substr(0, i), s.substr(i + 2).trim()];
	return [s, ''];
}
function strip(s: string, filter: RegExp = /\s+/g): string {
	return s.replace(filter, '');
}
const REX_ID          = /[^a-zA-Z0-9_$]/g;
const REX_SIMPLE_EXPR = /[^a-zA-Z0-9_$.()]/g;
const REX_EXPR        = /[^a-zA-Z0-9_$.,()!><=+']/g;
function identifier(s: string, filter: RegExp = REX_ID): string {
	const ss = s.trim().split(/\s+/);
	let i    = 0;
	const n  = ss.length;
	for (; i < n; i++) {
		ss[i] = strip(ss[i], filter);
		if (i > 0) ss[i] = cap1(ss[i]);
	}
	//Logger.log('identifier('+JSON.stringify(s)+')='+JSON.stringify(ss.join('')));
	return ss.join('');
}
function findUnescaped(haystack: string, needle: string, start?: number): number {
	let r = haystack.indexOf(needle, start);
	while (r > 0 && haystack[r - 1] === '\\') r = haystack.indexOf(needle, r + 1);
	return r;
}
function findIndent(e:TTextRun):number {
	return Math.max(e.par.getIndentFirstLine(),e.par.getIndentFirstLine())
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

function paragraphOf(ele:Element):Paragraph {
	while (ele && ele.getType() !== DocumentApp.ElementType.PARAGRAPH) ele = ele.getParent();
	return ele ? ele.asParagraph() : null;
}
function headingValue(h:DocumentApp.ParagraphHeading):number {
	switch (h) {
		case DocumentApp.ParagraphHeading.TITLE: return 0;
		case DocumentApp.ParagraphHeading.SUBTITLE: return 1;
		case DocumentApp.ParagraphHeading.HEADING1: return 2;
		case DocumentApp.ParagraphHeading.HEADING2: return 3;
		case DocumentApp.ParagraphHeading.HEADING3: return 4;
		case DocumentApp.ParagraphHeading.HEADING4: return 5;
		case DocumentApp.ParagraphHeading.HEADING5: return 6;
		case DocumentApp.ParagraphHeading.HEADING6: return 7;
		case DocumentApp.ParagraphHeading.NORMAL: return 8;
		default: return 10;
	}
}
function iterateFromHeader(header:Paragraph,code:(par:Paragraph)=>any) {
	let h0 = headingValue(header.getHeading());
	let next:Element = header;
	while (true) {
		do {
			next = next.getNextSibling();
		} while (next && next.getType() != DocumentApp.ElementType.PARAGRAPH);
		if (!next) break;
		let par = next.asParagraph();
		if (headingValue(par.getHeading()) <= h0) {
			break;
		}
		code(par);
	}
}
