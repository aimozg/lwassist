/*
 * Created by aimozg on 18.06.2017.
 * Confidential until published on GitHub
 */
type GroupStyle = [string|null, string|null, string|null, string|null];
const GroupStyleZero = [null, null, null, null] as GroupStyle;
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

function formatDocument(files: TFile[], options: LWAPreferences): void {
	function formatBlock(run:TTextRun|null,depth2:number, boldable:boolean):void {
		if (!run) return;
		let sty = {};
		switch (options.blocksMode) {
			case 'none':
				break;
			case 'fill':
				styBg(sty, groupStyle(depth2)[3]);
				break;
			/*case 'fill2':
				styBg(groupStyle(depth2)[2],sty);
				break;*/
			case 'color':
				styFg(sty, groupStyle(depth2)[1]);
				break;
			case 'color2':
				styFg(sty, groupStyle(depth2)[2]);
				break;
			case 'both':
				styBg(sty, groupStyle(depth2)[3]);
				styFg(sty, groupStyle(depth2)[1]);
				break;
		}
		if (boldable && options.blocksBold) {
			styBold(sty, true);
		}
		run.element.setAttributes(run.i1,run.i2-1,sty);
	}
	function formatComment(run:TTextRun|null):void {
		if (!run) return;
		let sty = {};
		switch (options.commentsMode) {
			case 'none':
				break;
			case 'fill':
				styFg(sty, '#000000');
				styBg(sty, '#faefae');
				break;
			case 'italic':
				styItalic(sty, true);
				break;
			case 'color':
				styFg(sty, '#3d6666');
				styBg(sty, null);
				break;
		}
		run.element.setAttributes(run.i1,run.i2-1,sty);
	}
	function formatBtn(run:TTextRun|null):void {
		if (!run) return;
		let sty = {};
		switch (options.buttonsMode) {
			case 'none':
				break;
			case 'fill':
				styFg(sty, '#000000');
				styBg(sty, '#face8d');
				break;
			case 'mono':
				styFace(sty, 'Consolas');
				break;
			case 'boldmono':
				styBold(sty, true);
				styFace(sty, 'Consolas');
				break;
		}
		run.element.setAttributes(run.i1,run.i2-1,sty);
	}
	function formatStmt(stmt: TStatement|null, depth: number): void {
		if (!stmt) return;
		
		let depth2 = depth * 2;
		switch (stmt.type) {
			case 'text':
				formatBlock(stmt.run,depth2,false);
				break;
			case 'comment':
				formatComment(stmt.run);
				break;
			case 'if':
				formatBlock(stmt.run,depth2+1,true);
				formatStmts(stmt.thenBlock,depth+1);
				formatBlock(stmt.elseRun,depth2+1,true);
				formatStmt(stmt.elseIfBlock,depth);
				formatStmts(stmt.elseBlock,depth+1);
				formatBlock(stmt.endRun,depth2+1,false);
				break;
			case 'call':
			case 'exec':
				formatBlock(stmt.run,depth2,false);
				break;
			case 'button':
				formatBlock(stmt.run,depth2,false);
				formatBtn(stmt.run);
				break;
			default:
				formatBlock(stmt.run,depth2,false);
		}
	}
	function formatStmts(stmts: TStatement[]|null, depth: number): void {
		if (!stmts) return;
		for (let stmt of stmts) {
			formatStmt(stmt,depth);
		}
	}
	
	for (let file of files) {
		for (let method of file.methods) {
			formatStmts(method.statements, 0);
		}
	}
}
