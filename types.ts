/*
 * Created by aimozg on 18.06.2017.
 * Confidential until published on GitHub
 */

import Document = DocumentApp.Document;
type EStatement = 'if' | 'call' | 'button' | 'text' | 'comment' | 'exec' | 'tag';
interface TTextRun {
	par: Paragraph;
	element: Text;
	i1: number;
	i2: number;
	text: string;
	bold: boolean;
	italic: boolean;
}
namespace TTextRun {
	export function toString(run:TTextRun):string {
		return "(" + run.i1 + ":" + run.i2 + " " + (run.bold ? "B" : "") + (run.italic ? "I" : "") +
			   " " + JSON.stringify(run.text.substring(0, 100)) + ")";
	}
}
interface IStatement {
	type: EStatement
	run: TTextRun | null;
}
interface StmtText extends IStatement {
	type: 'text';
	text: string;
}
interface StmtComment extends IStatement {
	type: 'comment';
	comment: string;
}
interface StmtButton extends IStatement {
	type: 'button';
	label: string;
	idx: number;
	action: string;
}
interface StmtCall extends IStatement {
	type: 'call';
	action: string;
}
interface StmtExec extends IStatement {
	type: 'exec';
	action: string;
}
interface StmtTag extends IStatement {
	type: 'tag';
	text: string;
}
interface StmtIf extends IStatement {
	type: 'if';
	condition: string;
	thenBlock: TStatement[];
	elseIfBlock: StmtIf | null;
	elseBlock: TStatement[] | null;
	elseRun: TTextRun | null;
	endRun: TTextRun | null;
}
/*interface StmtBlock extends IStatement {
	type: 'block';
	statements: TStatement[];
}*/
type TStatement = StmtText | StmtComment | StmtButton | StmtCall | StmtExec | StmtTag | StmtIf;
interface TMethod {
	name: string;
	buttons: boolean[];
	returns: boolean;
	
	file: TFile;
	
	comment: string;
	statements: TStatement[];
}
interface TConfigSection {
	file: TFile;
	comment: string;
}

interface TFile {
	name: string;
	path: string[];
	classname: string;
	superclass: string;
	
	document: Document,
	
	comment: string;
	config: TConfigSection;
	methods: TMethod[];
}

