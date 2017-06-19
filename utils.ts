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
function styBg(sty: any, bg: string):any {
	sty[DocumentApp.Attribute.BACKGROUND_COLOR] = bg;
	return sty;
}
function styFg(sty: any, fg: string):any {
	sty[DocumentApp.Attribute.FOREGROUND_COLOR] = fg;
	return sty;
}
function styBold(sty: any, bold: boolean):any {
	sty[DocumentApp.Attribute.BOLD] = ''+bold;
	return sty;
}
function styItalic(sty: any, italic: boolean):any {
	sty[DocumentApp.Attribute.ITALIC] = ''+italic;
	return sty;
}
function styFace(sty: any, fontFamily:string):any {
	sty[DocumentApp.Attribute.FONT_FAMILY] = fontFamily;
	return sty;
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