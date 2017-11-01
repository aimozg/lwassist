/*
 * Created by aimozg on 18.06.2017.
 * Confidential until published on GitHub
 */
type GroupStyle = [string|null, string|null, string|null, string|null];
const GroupStyleZero = ['#000000', '#000000', '#ffffff', '#ffffff'] as GroupStyle;
const GroupStyles    = [
	['#111144',
		'#222288',
		'#8888cc',
		'#ddddff'],
	['#441144',
		'#882288',
		'#cc88cc',
		'#ffddff'],
	['#441111',
		'#882222',
		'#cc8888',
		'#ffdddd'],
	['#443311',
		'#886622',
		'#ccaa88',
		'#ffeedd'],
	['#444444',
		'#888888',
		'#cccccc',
		'#eeeeee'],
	['#444411',
		'#888822',
		'#cccc88',
		'#ffffdd'],
	['#114411',
		'#228822',
		'#88cc88',
		'#ddffdd'],
	['#114444',
		'#228888',
		'#88cccc',
		'#ddffff'],
	['#111111',
		'#222222',
		'#888888',
		'#dddddd']
] as GroupStyle[];
function groupStyle(depth2:number):GroupStyle {
	return depth2 <= 0 ? GroupStyleZero : GroupStyles[(depth2+GroupStyles.length-1)%GroupStyles.length];
}

function formatSection(header:Paragraph,options:LWAPreferences):void {
	let depth = 0;
	iterateFromHeader(header,par=>{
		if (par.getHeading() === DocumentApp.ParagraphHeading.NORMAL) {
			let runs = splitParagraph(par);
			for (let run of runs) {
				switch (run.type) {
					case 'text':
						applyStyle(run,{fg:groupStyle(depth)[1]});
						break;
					case 'tag':
						applyStyle(run,{fg:'#7722aa'});
						break;
					case "comment":
						applyStyle(run,{fg:'#666666',face:'Consolas'});
						break;
					case "xml":
						let xi = (run as TTextRunXml).xml;
						applyStyle(run,{fg:'#227722',face:'Consolas'});
						if (!xi.single) {
							if (['case','default','if','else'].indexOf(xi.tag) != -1) {
								if (xi.open) depth++;
								if (xi.closing) depth--;
							}
						}
				}
			}
		} else {
			depth = 0;
		}
	});
	
}

function formatDocument(options:LWAPreferences ={}):void {
	//const userProperties = PropertiesService.getUserProperties();
	//userProperties.setProperty('flushFormat', ''+ options.applyFormat);
	Logger.clear();
	Logger.log("formatDocument("+JSON.stringify(options)+")");
	let doc = DocumentApp.getActiveDocument();
	let pos = doc.getCursor();
	let par = paragraphOf(pos.getElement());
	while (par && par.getHeading() === DocumentApp.ParagraphHeading.NORMAL) {
		par = paragraphOf(par.getPreviousSibling());
	}
	if (!par) return;
	formatSection(par,options);
}