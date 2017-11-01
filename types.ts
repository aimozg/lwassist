/*
 * Created by aimozg on 18.06.2017.
 * Confidential until published on GitHub
 */

import Document = DocumentApp.Document;
import Paragraph = DocumentApp.Paragraph;
import Text = DocumentApp.Text;
import Element = DocumentApp.Element;
import ContainerElement = DocumentApp.ContainerElement;
type ETextRunType = 'text'|'xml'|'tag'|'comment';
interface TTextRun {
	par: Paragraph;
	element: Text;
	i1: number;
	i2: number;
	text: string;
	bold: boolean;
	italic: boolean;
	type: ETextRunType;
}
interface TTextRunXml extends TTextRun {
	type:'xml';
	xml: XmlInfo;
}
namespace TTextRun {
	export function toString(run:TTextRun):string {
		return "(" +run.type+' '+ run.i1 + ":" + run.i2 + " " + (run.bold ? "B" : "") + (run.italic ? "I" : "") +
			   " " + JSON.stringify(run.text.substring(0, 100)) + ")";
	}
}