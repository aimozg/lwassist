/*
 * Created by aimozg on 01.11.2017.
 * Confidential until published on GitHub
 */

interface TExportResult {
	xml:string
}
function exportSection(header:Paragraph,options:LWAPreferences):string {
	type RunStyle = ''|'b'|'i'|'bi'|'ib';
	const ItalicOn = {
		'':'i','b':'bi','i':'i','bi':'bi','ib':'ib'
	} as {[index:string]:RunStyle};
	const BoldOn = {
		'':'b','b':'b','i':'ib','bi':'bi','ib':'ib'
	} as {[index:string]:RunStyle};
	const ItalicOff = {
		'':'','b':'b','i':'','bi':'b','ib':'b'
	} as {[index:string]:RunStyle};
	const BoldOff = {
		'':'','b':'','i':'i','bi':'i','ib':'i'
	} as {[index:string]:RunStyle};
	const IsItalic = {
		'':false,'b':false,'i':true,'bi':true,'ib':true
	} as {[index:string]:boolean};
	const IsBold = {
		'':false,'b':true,'i':false,'bi':true,'ib':true
	} as {[index:string]:boolean};
	function applyStyle(prev:RunStyle, next:RunStyle):string {
		return {
			'':{
				'':'',
				'b':'<b>',
				'i':'<i>',
				'bi':'<b><i>',
				'ib':'<i><b>'
			},
			'b':{
				'':'</b>',
				'b':'',
				'i':'</b><i>',
				'bi':'<i>',
				'ib':'</b><i><b>'
			},
			'i':{
				'':'</i>',
				'b':'</i><b>',
				'i':'',
				'bi':'</i><b><i>',
				'ib':'<b>'
			},
			'bi':{
				'':'</i></b>',
				'b':'</i>',
				'i':'</i></b><i>',
				'bi':'',
				'ib':'</i></b><i><b>'
			},
			'ib':{
				'':'</b></i>',
				'b':'</b></i><b>',
				'i':'</b>',
				'bi':'</b></i><b><i>',
				'ib':''
			},
		}[prev][next]
	}
	
	interface Story {
		heading:number,
		name:string,
		content:(Story|string)[],
		lastStyle:RunStyle;
	}
	function myName(par:Paragraph):string {
		return par.getText().split('/').reverse()[0];
	}
	function exportStory(s:Story):string {
		let tag:string = 'text';
		let body:string = s.content.map(obj=>{
			if (typeof obj === 'string') {
				return obj;
			} else {
				tag = 'lib';
				return exportStory(obj);
			}
		}).join('\n') + applyStyle(s.lastStyle,'');
		return `<${tag} name="${s.name}">`+'\n'+body+'\n'+`</${tag}>`;
	}
	
	let root:Story          = {
		heading:headingValue(header.getHeading()),
		name:myName(header),
		content:[],
		lastStyle:''
	};
	let stack:Story[] = [root];
	iterateFromHeader(header,par=>{
		let top = stack[0];
		if (par.getHeading() === DocumentApp.ParagraphHeading.NORMAL) {
			let runs = splitParagraph(par);
			let s = '';
			for (let run of runs) {
				let newStyle = top.lastStyle;
				if (run.italic && !IsItalic[top.lastStyle]) {
					newStyle = ItalicOn[newStyle];
				} else if (!run.italic && IsItalic[top.lastStyle]) {
					newStyle = ItalicOff[newStyle];
				}
				if (run.bold && !IsBold[top.lastStyle]) {
					newStyle = BoldOn[newStyle];
				} else if (!run.bold && IsBold[top.lastStyle]) {
					newStyle = BoldOff[newStyle];
				}
				s += applyStyle(top.lastStyle,newStyle)+run.text;
				if (top.lastStyle != newStyle) Logger.log("'"+top.lastStyle+"' -> '"+newStyle+"' by "+applyStyle(top.lastStyle,newStyle));
				top.lastStyle = newStyle;
			}
			s += applyStyle(top.lastStyle,'');
			top.lastStyle = '';
			top.content.push(s);
		} else {
			let h = headingValue(par.getHeading());
			while (h <= stack[0].heading) {
				Logger.log("pop("+stack[0].name+")");
				stack.shift();
			}
			// h > stack.heading
			let next:Story = {
				heading:h,
				name:myName(par),
				content:[],
				lastStyle:''
			};
			Logger.log("push("+next.name+")");
			stack[0].content.push(next);
			stack.unshift(next);
		}
	});
	return exportStory(root);
}
function exportDocument(options:LWAPreferences={}):TExportResult {
	Logger.clear();
	Logger.log("exportDocument("+JSON.stringify(options)+")");
	let doc = DocumentApp.getActiveDocument();
	let pos = doc.getCursor();
	let par = paragraphOf(pos.getElement());
	while (par && par.getHeading() === DocumentApp.ParagraphHeading.NORMAL) {
		par = paragraphOf(par.getPreviousSibling());
	}
	if (!par) return;
	let xml = exportSection(par,options);
	return {
		xml:xml
	};
}