/**
 * @OnlyCurrentDoc
 */

///<reference path="utils.ts"/>
///<reference path="formatter.ts"/>

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

}
function ifund<T>(x:T|undefined,y:T):T {
	return x === undefined ? y : x;
}
function getPreferences(): LWAPreferences {
	const userProperties = PropertiesService.getUserProperties();
	return {
		//applyFormat: ifund(userProperties.getProperty('applyFormat'),'false') == 'true',
	};
}
