/**
 * @OnlyCurrentDoc
 */

///<reference path="utils.ts"/>
///<reference path="formatter.ts"/>

import Element = DocumentApp.Element;
import Paragraph = DocumentApp.Paragraph;
import Text = DocumentApp.Text;
import ContainerElement = DocumentApp.ContainerElement;

function onOpen(e: { authMode: ScriptApp.AuthMode }): void {
	DocumentApp.getUi().createAddonMenu()
			   .addItem('Show', 'showSidebar')
			   .addToUi();
}

function onInstall(e: { authMode: ScriptApp.AuthMode }): void {
	onOpen(e);
}

function showSidebar(): void {
	const ui = HtmlService.createHtmlOutputFromFile('Sidebar')
						  .setTitle("Lewd Writer's Assistant");
	DocumentApp.getUi().showSidebar(ui);
}

interface LWAPreferences {
	applyFormat?: boolean; // "true" | "false"
	blocksMode?: string; // "none" | "fill" | "color" | "color2"
	blocksBold?: boolean; // "true" | "false"
	buttonsMode?: string; // "none" | "fill" | "mono" | "boldmono"
	commentsMode?: string; // "none" | "fill" | "color" | "italic"
}
function ifund<T>(x:T|undefined,y:T):T {
	return x === undefined ? y : x;
}
function getPreferences(): LWAPreferences {
	const userProperties = PropertiesService.getUserProperties();
	return {
		applyFormat: ifund(userProperties.getProperty('applyFormat'),'false') == 'true',
		blocksMode: ifund(userProperties.getProperty('colorBlocks'),'color'),
		blocksBold: ifund(userProperties.getProperty('blocksBold'),'false') == 'true',
		buttonsMode: ifund(userProperties.getProperty('buttonsMode'),'boldmono'),
		commentsMode: ifund(userProperties.getProperty('commentsMode'),'color')
	};
}

interface TResult {
	as3: string[];
}
function transpile(options: LWAPreferences = {}):TResult {
	const userProperties = PropertiesService.getUserProperties();
	userProperties.setProperty('flushFormat', ''+ options.applyFormat);
	userProperties.setProperty('blocksMode', ''+ options.blocksMode);
	userProperties.setProperty('blocksBold', ''+ options.blocksBold);
	userProperties.setProperty('buttonsMode', ''+ options.buttonsMode);
	userProperties.setProperty('commentsMode', ''+ options.commentsMode);
	Logger.clear();
	Logger.log("transplie("+JSON.stringify(options)+")");
	const result: TResult = {as3: []};
	const files = parseDocument(DocumentApp.getActiveDocument());
	result.as3 = writeSources(files);
	if (options.applyFormat) formatDocument(files,options);
	return result;
}

