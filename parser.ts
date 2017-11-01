/*
 * Created by aimozg on 18.06.2017.
 * Confidential until published on GitHub
 */


let LA_TEXT              = /^[^<\[\\]+/;
let LA_ENT               = /^&#?[a-zA-Z0-9]+;/;
let LA_TAG_OPEN          = /^\[/;
let LA_TAG_CONTENT       = /^[^<\]\\]+/;
let LA_XML_CLOSE         = /^<\/([a-zA-Z0-9_\-:]+)>/;
let LA_XML_TAG_START     = /^<([a-zA-Z0-9_\-:]+)/;
let LA_XML_TAG_INNER     = /^[^>]+/;
let LA_XML_TAG_END       = /^\/?>/;
let LA_XML_COMMENT       = /^<!--[\s\S\n]*?-->/;
function splitParagraph(par:Paragraph):TTextRun[] {
	
	let rslt:TTextRun[] = [];
	for (let ci=0,cn=par.getNumChildren();ci<cn;ci++) {
		let c = par.getChild(ci).asText();
		if (!c) continue;
		let runs = c.getTextAttributeIndices();
		let text = c.getText();
		runs.shift();
		runs.push(text.length);
		//Logger.log('runs = '+JSON.stringify(runs));
		// 1) Split text
		let textParts:string[] = [];
		while (text) {
			let m:string[];
			let text0 = text;
			if (text[0] == '\\') {
				if (text.length >= 2 && text[1] != '<') {
					textParts.push(text.slice(0,2));
					text = text.slice(2);
				} else {
					textParts.push(text);
					text = '';
				}
			} else if ((m = text.match(LA_TEXT))) {
				textParts.push(m[0]);
				text = text.slice(m[0].length);
			} else if ((m = text.match(LA_XML_COMMENT))) {
				textParts.push(m[0]);
				text = text.slice(m[0].length);
			} else if ((m = text.match(LA_ENT))) {
				textParts.push(m[0]);
				text = text.slice(m[0].length);
			} else if ((m = text.match(LA_TAG_OPEN))) {
				let s:string = m[0];
				text = text.slice(s.length);
				while (text) {
					if (text[0] == ']') {
						s += ']';
						text = text.slice(1);
						break;
					} else if (text[0] == '\\') {
						if (text.length >= 2 && text[1] != '<') {
							s += text.slice(0, 2);
							text = text.slice(2);
						} else {
							s += text[0];
							text = text.slice(1);
						}
					} else if ((m = text.match(LA_TAG_CONTENT))) {
						s += m[0];
						text = text.slice(m[0].length);
					} else {
						Logger.log('Illegal parser tag '+JSON.stringify(s+text)+' after '+JSON.stringify(textParts));
						return [];
					}
				}
				textParts.push(s);
			} else if ((m = text.match(LA_XML_CLOSE))) {
				textParts.push(m[0]);
				text = text.slice(m[0].length);
			} else if ((m = text.match(LA_XML_TAG_START))) {
				let s:string = m[0];
				text = text.slice(s.length);
				while(text) {
					if ((m = text.match(LA_XML_TAG_INNER))) {
						s += m[0];
						text = text.slice(m[0].length);
					} else if ((m = text.match(LA_XML_TAG_END))) {
						s += m[0];
						text = text.slice(m[0].length);
						break;
					} else {
						Logger.log('Illegal XML tag '+JSON.stringify(s+text)+' after '+JSON.stringify(textParts));
						return [];
					}
				}
				textParts.push(s);
			} else {
				textParts.push(text[0]);
				text = text.slice(1);
			}
			if (text == text0) {
				Logger.log('ERROR stuck on '+JSON.stringify(text)+' after '+JSON.stringify(textParts));
				return [];
			}
		}
		// 2) Subsplit is raw text and different formatting
		let i1 = 0;
		while(textParts.length>0) {
			let tp = textParts[0];
			let i2 = i1 + tp.length;
			if (tp[0] != '[' && tp[0] != '<' && tp[0] != '\\') {
				i2 = Math.min(runs[0], i2);
			}
			if (i1 >= i2) {
				Logger.log("ERROR: cannot create run "+i1+":"+i2+"; progress is "+rslt.map(TTextRun.toString));
				return [];
			}
			let type:ETextRunType;
			if (tp.match(LA_XML_COMMENT)) {
				type = 'comment'
			} else if (tp[0] == '<') {
				type = 'xml';
			} else if (tp[0] == '[') {
				type = 'tag';
			} else {
				type = 'text';
			}
			let run:TTextRun = {
				par    : par,
				element: c,
				i1     : i1,
				i2     : i2,
				text   : tp.slice(0, i2 - i1),
				bold   : c.isBold(i2 - 1),
				italic : c.isItalic(i2 - 1),
				type   : type
			};
			if (type == 'xml') (run as TTextRunXml).xml = parseXmlTag(run.text);
			rslt.push(run);
			tp = tp.slice(i2-i1);
			i1 = i2;
			if (tp) {
				textParts[0] = tp;
			} else {
				textParts.shift();
			}
			while (runs.length > 0 && runs[0] <= i2) runs.shift();
		}
	}
	return rslt;
}

interface XmlInfo {
	tag:string;
	single:boolean;
	closing:boolean;
	open:boolean;
}
function parseXmlTag(xml:string):XmlInfo {
	let m:string[];
	let x:XmlInfo = {tag:'',single:true,closing:false,open:false};
	if ((m = xml.match(LA_XML_TAG_START))) {
		x.tag = m[1];
		x.open = true;
		x.single = !!xml.match(/\/>$/);
	} else if ((m = xml.match(LA_XML_CLOSE))) {
		x.tag = m[1];
		x.closing = true;
		x.single = false;
	}
	return x;
}