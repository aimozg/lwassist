/*
 * Created by aimozg on 17.06.2017.
 * Created using Google Apps Script refernce licensed under the Creative Commons Attribution 3.0 License,
 * and its code samples licensed under the Apache 2.0 License.
 *
 *
 */
/*
var T=['function','public'][0];var tmp=$("#detailed-documentation").nextAll('div:not(.expandable)').toArray().map(e=>{
	e=$(e);
	var signature=e.find('h3').text().trim();
	var params=e.find('table.param tr:not(:first)').toArray().map(i=>Array.from(i.children).map(j=>j.textContent.trim()));
	for (var p of params) signature=signature.replace(p[0],p[0]+':'+p[1]);
	var doc = '\n'+e.find('p:first').text().trim();
	doc +='\n'+params.map(p=>'@param '+p[0]+' '+p[2]).join('\n');
	var ret = e.find('h4:last ~ p');
	if (ret.length>0) {
 		signature += ':'+e.find('h4:last ~ p > *:first').text();
		doc +='\n@return '+ret.text().trim();
	} else signature +=':void';
	return '\n/'+'**'+doc.replace(/\n/g,'\n * ')+'\n*'+'/\n'+T+' '+signature+';\n'
}).join('\n');console.log(tmp);copy(tmp);
 
 var T=['const','readonly'][1];var name=$('h1').text().trim().split(' ')[1];var tmp=$('table.property tr:not(:first)').toArray().map(t=>Array.from(t.children)).map(t=>'/*'+'*\n * '+t[2].innerText.replace(/\n/g,'\n * ')+'\n *'+'/\n'+T+' '+t[0].innerText+':'+name+';').join('\n\n');console.log(tmp);copy(tmp)
 */
type Integer = number;

declare class Blob {}
declare class BlobSource {}

declare type Button = string;
declare type ButtonSet = string;

declare class Logger {
	
	/**
	 * Clears the log.
	 *
	 */
	public static clear():void;
	
	
	/**
	 * Returns a complete list of messages in the current log. This method can be used to save or
	 *  email the entire log output generated during script execution.
	 *
	 * @return string — the log from the logging console
	 */
	public static getLog():string;
	
	
	/**
	 * Writes the string to the logging console. To view the logged output, select
	 *  View > Show logs. This can be very useful for debugging scripts.
	 * @param data the message to log
	 * @return Logger — the Logger, for chaining.
	 */
	public static log(data:any):Logger;
	
	
	/**
	 * Writes a formatted string to the logging console, using the format and values provided. The
	 *  string can include multiple %s placeholders, which are replaced with corresponding
	 *  values from the list of arguments, converted to strings.
	 * @param format a format string that contains as many instances of %s as the number of
	 *      values arguments
	 * @param values a variable number of values to insert into the format string
	 * @return Logger — the Logger, for chaining
	 */
	public static log(format:string, ...values:any[]):Logger;
	
}

declare class Menu {
	
	/**
	 * Adds an item to the menu. The label for a menu item should be in sentence case (only the first
	 *  word capitalized).
	 * @param caption the label for the menu item, with only the first word capitalized
	 * @param functionName the name of the function to invoke when the user selects the item
	 * @return Menu — this Menu, for chaining
	 */
	public addItem(caption:string, functionName:string):Menu;
	
	
	/**
	 * Adds a visual separator to the menu.
	 *
	 * @return Menu — this Menu, for chaining
	 */
	public addSeparator():Menu;
	
	
	/**
	 * Adds a sub-menu to the menu.
	 * @param menu the sub-menu, constructed like a top-level menu
	 * @return Menu — this Menu, for chaining
	 */
	public addSubMenu(menu:Menu):Menu;
	
	
	/**
	 * Inserts the menu into the instance of the editor's user interface.
	 *
	 */
	public addToUi():void;
	
}

declare class PromptResponse {
	
	/**
	 * Gets the text that the user entered in the dialog's input field. The text is available even if
	 *  the user closed the dialog by clicking a button with a negative connotation, like "Cancel" or
	 *  the close button in the dialog's title bar. getSelectedButton() can help to determine
	 *  whether the user intended the response text to be valid.
	 *
	 * @return string — the text that the user entered in the dialog's input field
	 */
	public getResponseText():string;
	
	
	/**
	 * Gets the button that the user clicked to dismiss the dialog. If the user clicked the close
	 *  button that is included in every dialog's title bar, this method returns Button.CLOSE.
	 *
	 * @return Button — the button that the user clicked
	 */
	public getSelectedButton():Button;
	
}

declare class SandboxMode {}

declare class Ui {
	
	/**
	 * Opens a dialog box in the user's editor with the given message and an "OK" button. This method
	 *  suspends the server-side script while the dialog is open. The script will resume after the user
	 *  dismisses the dialog, but Jdbc
	 *  connections and LockService locks will
	 *  not persist across the suspension. For more information, see the
	 *  guide to dialogs and sidebars.
	 * @param prompt the message to display in the dialog box
	 * @return Button — the button the user clicked
	 */
	public alert(prompt:string):Button;
	
	
	/**
	 * Opens a dialog box in the user's editor with the given message and set of buttons. This method
	 *  suspends the server-side script while the dialog is open. The script will resume after the user
	 *  dismisses the dialog, but Jdbc
	 *  connections and LockService locks will
	 *  not persist across the suspension. For more information, see the
	 *  guide to dialogs and sidebars.
	 * @param prompt the message to display in the dialog box
	 * @param buttons the button set to display in the dialog box
	 * @return Button — the button the user clicked
	 */
	public alert(prompt:string, buttons:ButtonSet):Button;
	
	
	/**
	 * Opens a dialog box in the user's editor with the given title, message, and set of buttons. This
	 *  method suspends the server-side script while the dialog is open. The script will resume after
	 *  the user dismisses the dialog, but Jdbc
	 *  connections and LockService locks will
	 *  not persist across the suspension. For more information, see the
	 *  guide to dialogs and sidebars.
	 * @param title the title to display above the dialog box
	 * @param prompt the message to display in the dialog box
	 * @param buttons the button set to display in the dialog box
	 * @return Button — the button the user clicked
	 */
	public alert(title:string, prompt:string, buttons:ButtonSet):Button;
	
	
	/**
	 * Creates a builder that can be used to insert a sub-menu into the editor's Add-on menu. The
	 *  menu will not actually be updated until Menu.addToUi() is called. If the script is
	 *  running as an add-on, the sub-menu name will match the add-on's name in the web store; if
	 *  the script is bound to the document directly,
	 *  the sub-menu name will match the script's name. For more information, see the
	 *  guide to menus.
	 *
	 * @return Menu — the new menu builder
	 */
	public createAddonMenu():Menu;
	
	
	/**
	 * Creates a builder that can be used to add a menu to the editor's user interface. The menu will
	 *  not actually be added until Menu.addToUi() is called. For more information, see the
	 *  guide to menus. The label for a top-level menu should
	 *  be in headline case (all major words capitalized), although the label for a sub-menu should be
	 *  in sentence case (only the first word capitalized). If the script is published as an
	 *  add-on, the caption parameter is ignored and the
	 *  menu is added as a sub-menu of the Add-ons menu, equivalent to createAddonMenu().
	 * @param caption the label for the menu, with all major words capitalized for a top-level menu,
	 *      or only the first word capitalized for a sub-menu
	 * @return Menu — the new menu builder
	 */
	public createMenu(caption:string):Menu;
	
	
	/**
	 * Opens an input dialog box in the user's editor with the given message and an "OK" button. This
	 *  method suspends the server-side script while the dialog is open. The script will resume after
	 *  the user dismisses the dialog, but Jdbc
	 *  connections and LockService locks will
	 *  not persist across the suspension. For more information, see the
	 *  guide to dialogs and sidebars.
	 * @param prompt the message to display in the dialog box
	 * @return PromptResponse — a representation of the user's response
	 */
	public prompt(prompt:string):PromptResponse;
	
	
	/**
	 * Opens an input dialog box in the user's editor with the given message and set of buttons. This
	 *  method suspends the server-side script while the dialog is open. The script will resume after
	 *  the user dismisses the dialog, but Jdbc
	 *  connections and LockService locks will
	 *  not persist across the suspension. For more information, see the
	 *  guide to dialogs and sidebars.
	 * @param prompt the message to display in the dialog box
	 * @param buttons the button set to display in the dialog box
	 * @return PromptResponse — a representation of the user's response
	 */
	public prompt(prompt:string, buttons:ButtonSet):PromptResponse;
	
	
	/**
	 * Opens an input dialog box in the user's editor with the given title, message, and set of
	 *  buttons. This method suspends the server-side script while the dialog is open. The script will
	 *  resume after the user dismisses the dialog, but
	 *  Jdbc connections and
	 *  LockService locks will not persist across
	 *  the suspension. For more information, see the
	 *  guide to dialogs and sidebars.
	 * @param title the title to display above the dialog box
	 * @param prompt the message to display in the dialog box
	 * @param buttons the button set to display in the dialog box
	 * @return PromptResponse — a representation of the user's response
	 */
	public prompt(title:string, prompt:string, buttons:ButtonSet):PromptResponse;
	
	
	/**
	 * Opens a modal dialog box in the user's editor with custom client-side content. This method does
	 *  not suspend the server-side script while the dialog is open. To communicate with the
	 *  server-side script, the client-side component must make asynchronous callbacks using either
	 *  the google.script API for
	 *  HtmlService or
	 *  server handlers for
	 *  UiApp. To close the dialog
	 *  programmatically, call
	 *  google.script.host.close() on the client side of an HtmlService web
	 *  app or UiInstance.close() from a
	 *  UiApp web app. For more information, see the
	 *  guide to dialogs and sidebars.
	 * @param userInterface an HtmlOutput or
	 *      UiInstance web app
	 * @param title the title of the dialog; overrides any title set by calling setTitle() on
	 *      the userInterface object
	 */
	public showModalDialog(userInterface:any, title:string):void;
	
	
	/**
	 * Opens a modeless dialog box in the user's editor with custom client-side content. This method
	 *  does not suspend the server-side script while the dialog is open. To communicate with
	 *  the server-side script, the client-side component must make asynchronous callbacks using either
	 *  the google.script API for
	 *  HtmlService or
	 *  server handlers for
	 *  UiApp. To close the dialog
	 *  programmatically, call
	 *  google.script.host.close() on the client side of an HtmlService web
	 *  app or UiInstance.close() from a
	 *  UiApp web app. For more information, see the
	 *  guide to dialogs and sidebars.
	 * @param userInterface an HtmlOutput or
	 *      UiInstance web app
	 * @param title the title of the dialog; overrides any title set by calling setTitle() on
	 *      the userInterface object
	 */
	public showModelessDialog(userInterface:any, title:string):void;
	
	
	/**
	 * Opens a sidebar in the user's editor with custom client-side content. This method does
	 *  not suspend the server-side script while the sidebar is open. To communicate with the
	 *  server-side script, the client-side component must make asynchronous callbacks using either
	 *  the google.script API for
	 *  HtmlService or
	 *  server handlers for
	 *  UiApp. To close the sidebar
	 *  programmatically, call
	 *  google.script.host.close() on the client side of an HtmlService web
	 *  app or UiInstance.close() from a
	 *  UiApp web app. For more information, see the
	 *  guide to dialogs and sidebars.
	 * @param userInterface an HtmlOutput or
	 *      UiInstance web app
	 */
	public showSidebar(userInterface:any):void;
	
	/**
	 * The standard close button displayed in every dialog's title bar. This button is not explicitly added to a dialog, and it cannot be removed.
	 */
	readonly CLOSE:Button;
	
	/**
	 * An "OK" button, indicating that an operation should proceed.
	 */
	readonly OK:Button;
	
	/**
	 * A "Cancel" button, indicating that an operation should not proceed.
	 */
	readonly CANCEL:Button;
	
	/**
	 * A "Yes" button, indicating a positive response to a question.
	 */
	readonly YES:Button;
	
	/**
	 * A "No" button, indicating a negative response to a question.
	 */
	readonly NO:Button;
	
	/**
	 * An "OK" button and a "Cancel" button, allowing the user to either proceed with or halt an operation.
	 */
	readonly OK_CANCEL:ButtonSet;
	
	/**
	 * A "Yes" button and a "No" button, allowing the user to answer a yes/no question.
	 */
	readonly YES_NO:ButtonSet;
	
	/**
	 * A "Yes" button, a "No" button, and a "Cancel" button, allowing the user to either answer a yes/no question or halt an operation.
	 */
	readonly YES_NO_CANCEL:ButtonSet;
}

declare class User {}

declare namespace DocumentApp {
	
	type Attribute = string;
	namespace Attribute {
		/**
		 * The background color of an element (Paragraph, Table, etc) or document.
		 */
		const BACKGROUND_COLOR:Attribute;
		
		/**
		 * The font weight setting, for rich text.
		 */
		const BOLD:Attribute;
		
		/**
		 * The border color, for table elements.
		 */
		const BORDER_COLOR:Attribute;
		
		/**
		 * The border width in points, for table elements.
		 */
		const BORDER_WIDTH:Attribute;
		
		/**
		 * The code contents, for equation elements.
		 */
		const CODE:Attribute;
		
		/**
		 * The font family setting, for rich text.
		 */
		const FONT_FAMILY:Attribute;
		
		/**
		 * The font size setting in points, for rich text.
		 */
		const FONT_SIZE:Attribute;
		
		/**
		 * The foreground color setting, for rich text.
		 */
		const FOREGROUND_COLOR:Attribute;
		
		/**
		 * The heading type, for paragraph elements (for example, DocumentApp.ParagraphHeading.HEADING1).
		 */
		const HEADING:Attribute;
		
		/**
		 * The height setting, for image elements.
		 */
		const HEIGHT:Attribute;
		
		/**
		 * The horizontal alignment, for paragraph elements (for example, DocumentApp.HorizontalAlignment.CENTER).
		 */
		const HORIZONTAL_ALIGNMENT:Attribute;
		
		/**
		 * The end indentation setting in points, for paragraph elements.
		 */
		const INDENT_END:Attribute;
		
		/**
		 * The first line indentation setting in points, for paragraph elements.
		 */
		const INDENT_FIRST_LINE:Attribute;
		
		/**
		 * The start indentation setting in points, for paragraph elements.
		 */
		const INDENT_START:Attribute;
		
		/**
		 * The font style setting, for rich text.
		 */
		const ITALIC:Attribute;
		
		/**
		 * The glyph type, for list item elements.
		 */
		const GLYPH_TYPE:Attribute;
		
		/**
		 * The text direction setting, for rich text.
		 */
		const LEFT_TO_RIGHT:Attribute;
		
		/**
		 * The line spacing setting as a multiplier, for paragraph elements.
		 */
		const LINE_SPACING:Attribute;
		
		/**
		 * The link URL, for rich text. The default link style (foreground color, underline) is automatically applied.
		 */
		const LINK_URL:Attribute;
		
		/**
		 * The ID of the encompassing list, for list item elements.
		 */
		const LIST_ID:Attribute;
		
		/**
		 * The bottom margin setting in points, for paragraph elements.
		 */
		const MARGIN_BOTTOM:Attribute;
		
		/**
		 * The left margin setting in points, for paragraph elements.
		 */
		const MARGIN_LEFT:Attribute;
		
		/**
		 * The right margin setting in points, for paragraph elements.
		 */
		const MARGIN_RIGHT:Attribute;
		
		/**
		 * The top margin setting in points, for paragraph elements.
		 */
		const MARGIN_TOP:Attribute;
		
		/**
		 * The item nesting level, for list item elements.
		 */
		const NESTING_LEVEL:Attribute;
		
		/**
		 * The minimum height setting in points, for table row elements.
		 */
		const MINIMUM_HEIGHT:Attribute;
		
		/**
		 * The bottom padding setting in points, for table cell elements.
		 */
		const PADDING_BOTTOM:Attribute;
		
		/**
		 * The left padding setting in points, for table cell elements.
		 */
		const PADDING_LEFT:Attribute;
		
		/**
		 * The right padding setting in points, for table cell elements.
		 */
		const PADDING_RIGHT:Attribute;
		
		/**
		 * The top padding setting in points, for table cell elements.
		 */
		const PADDING_TOP:Attribute;
		
		/**
		 * The page height setting in points, for documents.
		 */
		const PAGE_HEIGHT:Attribute;
		
		/**
		 * The page width setting in points, for documents.
		 */
		const PAGE_WIDTH:Attribute;
		
		/**
		 * The bottom spacing setting in points, for paragraph elements.
		 */
		const SPACING_AFTER:Attribute;
		
		/**
		 * The top spacing setting in points, for paragraph elements.
		 */
		const SPACING_BEFORE:Attribute;
		
		/**
		 * The strike-through setting, for rich text.
		 */
		const STRIKETHROUGH:Attribute;
		
		/**
		 * The underline setting, for rich text.
		 */
		const UNDERLINE:Attribute;
		
		/**
		 * The vertical alignment setting, for table cell elements.
		 */
		const VERTICAL_ALIGNMENT:Attribute;
		
		/**
		 * The width setting, for table cell and image elements.
		 */
		const WIDTH:Attribute;
	}
	
	class Body extends ContainerElement {
		/**
		 * Creates and appends a new HorizontalRule.
		 *
		 * @return HorizontalRule — the new horizontal rule
		 */
		public appendHorizontalRule():HorizontalRule;
		
		
		/**
		 * Creates and appends a new InlineImage from the specified
		 *  image blob.
		 * @param image the image data
		 * @return InlineImage — the appended image
		 */
		public appendImage(image:BlobSource):InlineImage;
		
		
		/**
		 * Appends the given InlineImage.
		 * @param image the image data
		 * @return InlineImage — the appended image
		 */
		public appendImage(image:InlineImage):InlineImage;
		
		
		/**
		 * Appends the given ListItem.
		 * @param listItem the list item to append
		 * @return ListItem — the appended list item
		 */
		public appendListItem(listItem:ListItem):ListItem;
		
		
		/**
		 * Creates and appends a new ListItem containing the specified text
		 *  contents.
		 * @param text the list item's text contents
		 * @return ListItem — the new list item
		 */
		public appendListItem(text:string):ListItem;
		
		
		/**
		 * Creates and appends a new PageBreak.
		 *
		 * @return PageBreak — the new page break
		 */
		public appendPageBreak():PageBreak;
		
		
		/**
		 * Appends the given PageBreak.
		 * @param pageBreak the page break to append
		 * @return PageBreak — the appended page break
		 */
		public appendPageBreak(pageBreak:PageBreak):PageBreak;
		
		
		/**
		 * Appends the given Paragraph.
		 * @param paragraph the paragraph to append
		 * @return Paragraph — the appended paragraph
		 */
		public appendParagraph(paragraph:Paragraph):Paragraph;
		
		
		/**
		 * Creates and appends a new Paragraph containing the specified text
		 *  contents.
		 * @param text the paragraph's text contents
		 * @return Paragraph — the new paragraph
		 */
		public appendParagraph(text:string):Paragraph;
		
		
		/**
		 * Creates and appends a new Table.
		 *
		 * @return Table — the new table
		 */
		public appendTable():Table;
		
		
		/**
		 * Appends a new Table containing a TableCell for each
		 *  specified string value.
		 * @param cells the text contents of the table cells to add to the new table
		 * @return Table — the appended table
		 */
		public appendTable(cells:string[][]):Table;
		
		
		/**
		 * Appends the given Table.
		 * @param table the table to append
		 * @return Table — the appended table
		 */
		public appendTable(table:Table):Table;
		
		
		/**
		 * Clears the contents of the element.
		 *
		 * @return Body — the current element
		 */
		public clear():Body;
		
		
		/**
		 * Returns a detached, deep copy of the current element.
		 *
		 * @return Body — the new copy
		 */
		public copy():Body;
		
		
		/**
		 * Obtains a Text version of the current element, for editing.
		 *
		 * @return Text — a text version of the current element
		 */
		public editAsText():Text;
		
		
		/**
		 * Searches the contents of the element for a descendant of the specified
		 *  type.
		 * @param elementType the type of element to search for
		 * @return RangeElement — a search result indicating the position of the search element
		 */
		public findElement(elementType:ElementType):RangeElement;
		
		
		/**
		 * Searches the contents of the element for a descendant of the specified
		 *  type, starting from the specified RangeElement.
		 * @param elementType the type of element to search for
		 * @param from the search result to search from
		 * @return RangeElement — a search result indicating the next position of the search element
		 */
		public findElement(elementType:ElementType, from:RangeElement):RangeElement;
		
		
		/**
		 * Searches the contents of the element for the specified text pattern using
		 *  regular expressions.
		 * @param searchPattern the pattern to search for
		 * @return RangeElement — a search result indicating the position of the search text, or null
		 *      if there is no match
		 */
		public findText(searchPattern:string):RangeElement;
		
		
		/**
		 * Searches the contents of the element for the specified text pattern,
		 *  starting from a given search result.
		 * @param searchPattern the pattern to search for
		 * @param from the search result to search from
		 * @return RangeElement — a search result indicating the next position of the search text, or
		 *      null if there is no match
		 */
		public findText(searchPattern:string, from:RangeElement):RangeElement;
		
		
		/**
		 * Retrieves the element's attributes.
		 *
		 * @return any — the element's attributes
		 */
		public getAttributes():any;
		
		
		/**
		 * Retrieves the child element at the specified child index.
		 * @param childIndex the index of the child element to retrieve
		 * @return Element — the child element at the specified index
		 */
		public getChild(childIndex:Integer):Element;
		
		
		/**
		 * Retrieves the child index for the specified child element.
		 * @param child the child element for which to retrieve the index
		 * @return Integer — the child index
		 */
		public getChildIndex(child:Element):Integer;
		
		
		/**
		 * Retrieves the set of attributes for the provided ParagraphHeading.
		 * @param paragraphHeading the heading whose attributes will be retrieved
		 * @return any — a map of the attributes and their current values
		 */
		public getHeadingAttributes(paragraphHeading:ParagraphHeading):any;
		
		
		/**
		 * Retrieves all the InlineImages contained in the section.
		 *
		 * @return InlineImage[] — the section images
		 */
		public getImages():InlineImage[];
		
		
		/**
		 * Retrieves all the ListItems contained in the section.
		 *
		 * @return ListItem[] — the section list items
		 */
		public getListItems():ListItem[];
		
		
		/**
		 * Retrieves the bottom margin, in points.
		 *
		 * @return number — the bottom margin, in points
		 */
		public getMarginBottom():number;
		
		
		/**
		 * Retrieves the left margin, in points.
		 *
		 * @return number — the left margin, in points
		 */
		public getMarginLeft():number;
		
		
		/**
		 * Retrieves the right margin.
		 *
		 * @return number — the right margin, in points
		 */
		public getMarginRight():number;
		
		
		/**
		 * Retrieves the top margin.
		 *
		 * @return number — the top margin, in points
		 */
		public getMarginTop():number;
		
		
		/**
		 * Retrieves the number of children.
		 *
		 * @return Integer — the number of children
		 */
		public getNumChildren():Integer;
		
		
		/**
		 * Retrieves the page height, in points.
		 *
		 * @return number — the page height, in points
		 */
		public getPageHeight():number;
		
		
		/**
		 * Retrieves the page width, in points.
		 *
		 * @return number — the page width, in points
		 */
		public getPageWidth():number;
		
		
		/**
		 * Retrieves all the Paragraphs contained in the section (including
		 *  ListItems).
		 *
		 * @return Paragraph[] — the section paragraphs
		 */
		public getParagraphs():Paragraph[];
		
		
		/**
		 * Retrieves the element's parent element.
		 *
		 * @return ContainerElement — the parent element
		 */
		public getParent():ContainerElement;
		
		
		/**
		 * Retrieves all the Tables contained in the section.
		 *
		 * @return Table[] — the section tables
		 */
		public getTables():Table[];
		
		
		/**
		 * Retrieves the contents of the element as a text string.
		 *
		 * @return string — the contents of the element as text string
		 */
		public getText():string;
		
		
		/**
		 * Gets the text alignment. The available types of alignment are
		 *  DocumentApp.TextAlignment.NORMAL, DocumentApp.TextAlignment.SUBSCRIPT, and
		 *  DocumentApp.TextAlignment.SUPERSCRIPT.
		 *
		 * @return TextAlignment — the type of text alignment, or null if the text contains multiple types of
		 *      text alignments or if the text alignment has never been set
		 */
		public getTextAlignment():TextAlignment;
		
		
		/**
		 * Retrieves the element's ElementType.
		 *
		 * @return ElementType — the element type
		 */
		public getType():ElementType;
		
		
		/**
		 * Creates and inserts a new HorizontalRule at the specified index.
		 * @param childIndex the index at which to insert the element
		 * @return HorizontalRule — the new horizontal rule
		 */
		public insertHorizontalRule(childIndex:Integer):HorizontalRule;
		
		
		/**
		 * Creates and inserts an InlineImage from the specified image blob,
		 *  at the specified index.
		 * @param childIndex the index at which to insert the element
		 * @param image the image data
		 * @return InlineImage — the inserted inline image
		 */
		public insertImage(childIndex:Integer, image:BlobSource):InlineImage;
		
		
		/**
		 * Inserts the given InlineImage at the specified index.
		 * @param childIndex the index at which to insert the element
		 * @param image the image to insert
		 * @return InlineImage — the inserted inline image
		 */
		public insertImage(childIndex:Integer, image:InlineImage):InlineImage;
		
		
		/**
		 * Inserts the given ListItem at the specified index.
		 * @param childIndex the index at which to insert
		 * @param listItem the list item to insert
		 * @return ListItem — the inserted list item
		 */
		public insertListItem(childIndex:Integer, listItem:ListItem):ListItem;
		
		
		/**
		 * Creates and inserts a new ListItem at the specified index,
		 *  containing the specified text contents.
		 * @param childIndex the index at which to insert
		 * @param text the list item's text contents
		 * @return ListItem — the new list item
		 */
		public insertListItem(childIndex:Integer, text:string):ListItem;
		
		
		/**
		 * Creates and inserts a new PageBreak at the specified index.
		 * @param childIndex the index at which to insert the element
		 * @return PageBreak — the new page break
		 */
		public insertPageBreak(childIndex:Integer):PageBreak;
		
		
		/**
		 * Inserts the given PageBreak at the specified index.
		 * @param childIndex the index at which to insert the element
		 * @param pageBreak the p[age break to insert
		 * @return PageBreak — the inserted page break
		 */
		public insertPageBreak(childIndex:Integer, pageBreak:PageBreak):PageBreak;
		
		
		/**
		 * Inserts the given Paragraph at the specified index.
		 * @param childIndex the index at which to insert
		 * @param paragraph the paragraph to insert
		 * @return Paragraph — the inserted paragraph
		 */
		public insertParagraph(childIndex:Integer, paragraph:Paragraph):Paragraph;
		
		
		/**
		 * Creates and inserts a new Paragraph at the specified index,
		 *  containing the specified text contents.
		 * @param childIndex the index at which to insert
		 * @param text the paragraph's text contents
		 * @return Paragraph — the new paragraph
		 */
		public insertParagraph(childIndex:Integer, text:string):Paragraph;
		
		
		/**
		 * Creates and inserts a new Table at the specified index.
		 * @param childIndex the index at which to insert
		 * @return Table — the new table
		 */
		public insertTable(childIndex:Integer):Table;
		
		
		/**
		 * Creates and inserts a new Table containing the specified cells,
		 *  at the specified index.
		 * @param childIndex the index at which to insert
		 * @param cells the text contents of the table cells to add to the new table
		 * @return Table — the new table
		 */
		public insertTable(childIndex:Integer, cells:string[][]):Table;
		
		
		/**
		 * Inserts the given Table at the specified index.
		 * @param childIndex the index at which to insert
		 * @param table the table to insert
		 * @return Table — the inserted table
		 */
		public insertTable(childIndex:Integer, table:Table):Table;
		
		
		/**
		 * Removes the specified child element.
		 * @param child the child element to remove
		 * @return Body — the current element
		 */
		public removeChild(child:Element):Body;
		
		
		/**
		 * Replaces all occurrences of a given text pattern with a given replacement
		 *  string, using regular expressions.
		 * @param searchPattern the regex pattern to search for
		 * @param replacement the text to use as replacement
		 * @return Element — the current element
		 */
		public replaceText(searchPattern:string, replacement:string):Element;
		
		
		/**
		 * Sets the element's attributes.
		 * @param attributes the element's attributes
		 * @return Body — the current element
		 */
		public setAttributes(attributes:any):Body;
		
		
		/**
		 * Sets the attributes for the provided ParagraphHeading.
		 * @param paragraphHeading the heading whose attributes will be set
		 * @param attributes a map of attributes and the values to set them to
		 * @return Body — the current element
		 */
		public setHeadingAttributes(paragraphHeading:ParagraphHeading, attributes:any):Body;
		
		
		/**
		 * Sets the bottom margin, in points.
		 * @param marginBottom the bottom margin, in points
		 * @return Body — the current element
		 */
		public setMarginBottom(marginBottom:number):Body;
		
		
		/**
		 * Sets the left margin, in points.
		 * @param marginLeft the left margin, in points
		 * @return Body — the current element
		 */
		public setMarginLeft(marginLeft:number):Body;
		
		
		/**
		 * Sets the right margin, in points.
		 * @param marginRight the right margin
		 * @return Body — the current element
		 */
		public setMarginRight(marginRight:number):Body;
		
		
		/**
		 * Sets the top margin.
		 * @param marginTop the top margin, in points
		 * @return Body — the current element
		 */
		public setMarginTop(marginTop:number):Body;
		
		
		/**
		 * Sets the page height, in points.
		 * @param pageHeight the page height, in points
		 * @return Body — the current element
		 */
		public setPageHeight(pageHeight:number):Body;
		
		
		/**
		 * Sets the page width, in points.
		 * @param pageWidth the page width, in points
		 * @return Body — the current element
		 */
		public setPageWidth(pageWidth:number):Body;
		
		
		/**
		 * Sets the contents as plain text.
		 * @param text the new text contents
		 * @return Body — the current element
		 */
		public setText(text:string):Body;
		
		
		/**
		 * Sets the text alignment. The available types of alignment are
		 *  DocumentApp.TextAlignment.NORMAL, DocumentApp.TextAlignment.SUBSCRIPT, and
		 *  DocumentApp.TextAlignment.SUPERSCRIPT.
		 * @param textAlignment the type of text alignment to apply
		 * @return Body — the current element
		 */
		public setTextAlignment(textAlignment:TextAlignment):Body;
	}
	
	class Bookmark {}
	
	class ContainerElement extends Element {
		
		/**
		 * Returns the current element as a Body.
		 *
		 * @return Body — the current element
		 */
		public asBody():Body;
		
		
		/**
		 * Returns the current element as a Equation.
		 *
		 * @return Equation — the current element
		 */
		public asEquation():Equation;
		
		
		/**
		 * Returns the current element as a FooterSection.
		 *
		 * @return FooterSection — the current element
		 */
		public asFooterSection():FooterSection;
		
		
		/**
		 * Returns the current element as a FootnoteSection.
		 *
		 * @return FootnoteSection — the current element
		 */
		public asFootnoteSection():FootnoteSection;
		
		
		/**
		 * Returns the current element as a HeaderSection.
		 *
		 * @return HeaderSection — the current element
		 */
		public asHeaderSection():HeaderSection;
		
		
		/**
		 * Returns the current element as a ListItem.
		 *
		 * @return ListItem — the current element
		 */
		public asListItem():ListItem;
		
		
		/**
		 * Returns the current element as a Paragraph.
		 *
		 * @return Paragraph — the current element
		 */
		public asParagraph():Paragraph;
		
		
		/**
		 * Returns the current element as a Table.
		 *
		 * @return Table — the current element
		 */
		public asTable():Table;
		
		
		/**
		 * Returns the current element as a TableCell.
		 *
		 * @return TableCell — the current element
		 */
		public asTableCell():TableCell;
		
		
		/**
		 * Returns the current element as a TableOfContents.
		 *
		 * @return TableOfContents — the current element
		 */
		public asTableOfContents():TableOfContents;
		
		
		/**
		 * Returns the current element as a TableRow.
		 *
		 * @return TableRow — the current element
		 */
		public asTableRow():TableRow;
		
		
		/**
		 * Clears the contents of the element.
		 *
		 * @return ContainerElement — the current element
		 */
		public clear():ContainerElement;
		
		
		/**
		 * Returns a detached, deep copy of the current element.
		 *
		 * @return ContainerElement — the new copy
		 */
		public copy():ContainerElement;
		
		
		/**
		 * Obtains a Text version of the current element, for editing.
		 *
		 * @return Text — a text version of the current element
		 */
		public editAsText():Text;
		
		
		/**
		 * Searches the contents of the element for a descendant of the specified
		 *  type.
		 * @param elementType the type of element to search for
		 * @return RangeElement — a search result indicating the position of the search element
		 */
		public findElement(elementType:ElementType):RangeElement;
		
		
		/**
		 * Searches the contents of the element for a descendant of the specified
		 *  type, starting from the specified RangeElement.
		 * @param elementType the type of element to search for
		 * @param from the search result to search from
		 * @return RangeElement — a search result indicating the next position of the search element
		 */
		public findElement(elementType:ElementType, from:RangeElement):RangeElement;
		
		
		/**
		 * Searches the contents of the element for the specified text pattern using
		 *  regular expressions.
		 * @param searchPattern the pattern to search for
		 * @return RangeElement — a search result indicating the position of the search text, or null
		 *      if there is no match
		 */
		public findText(searchPattern:string):RangeElement;
		
		
		/**
		 * Searches the contents of the element for the specified text pattern,
		 *  starting from a given search result.
		 * @param searchPattern the pattern to search for
		 * @param from the search result to search from
		 * @return RangeElement — a search result indicating the next position of the search text, or
		 *      null if there is no match
		 */
		public findText(searchPattern:string, from:RangeElement):RangeElement;
		
		
		/**
		 * Retrieves the element's attributes.
		 *
		 * @return Object — the element's attributes
		 */
		public getAttributes():Object;
		
		
		/**
		 * Retrieves the child element at the specified child index.
		 * @param childIndex the index of the child element to retrieve
		 * @return Element — the child element at the specified index
		 */
		public getChild(childIndex:Integer):Element;
		
		
		/**
		 * Retrieves the child index for the specified child element.
		 * @param child the child element for which to retrieve the index
		 * @return Integer — the child index
		 */
		public getChildIndex(child:Element):Integer;
		
		
		/**
		 * Retrieves the link url.
		 *
		 * @return string — the link url, or null if the element contains multiple values
		 *      for this attribute
		 */
		public getLinkUrl():string;
		
		
		/**
		 * Retrieves the element's next sibling element.
		 *
		 * @return Element — the next sibling element
		 */
		public getNextSibling():Element;
		
		
		/**
		 * Retrieves the number of children.
		 *
		 * @return Integer — the number of children
		 */
		public getNumChildren():Integer;
		
		
		/**
		 * Retrieves the element's parent element.
		 *
		 * @return ContainerElement — the parent element
		 */
		public getParent():ContainerElement;
		
		
		/**
		 * Retrieves the element's previous sibling element.
		 *
		 * @return Element — the previous sibling element
		 */
		public getPreviousSibling():Element;
		
		
		/**
		 * Retrieves the contents of the element as a text string.
		 *
		 * @return string — the contents of the element as text string
		 */
		public getText():string;
		
		
		/**
		 * Gets the text alignment. The available types of alignment are
		 *  DocumentApp.TextAlignment.NORMAL, DocumentApp.TextAlignment.SUBSCRIPT, and
		 *  DocumentApp.TextAlignment.SUPERSCRIPT.
		 *
		 * @return TextAlignment — the type of text alignment, or null if the text contains multiple types of
		 *      text alignments or if the text alignment has never been set
		 */
		public getTextAlignment():TextAlignment;
		
		
		/**
		 * Retrieves the element's ElementType.
		 *
		 * @return ElementType — the element type
		 */
		public getType():ElementType;
		
		
		/**
		 * Determines whether the element is at the end of the
		 *  Document.
		 *
		 * @return boolean — whether the element is at the end of the document
		 */
		public isAtDocumentEnd():boolean;
		
		
		/**
		 * Merges the element with the preceding sibling of the same type.
		 *
		 * @return ContainerElement — the merged element
		 */
		public merge():ContainerElement;
		
		
		/**
		 * Removes the element from its parent.
		 *
		 * @return ContainerElement — the removed element
		 */
		public removeFromParent():ContainerElement;
		
		
		/**
		 * Replaces all occurrences of a given text pattern with a given replacement
		 *  string, using regular expressions.
		 * @param searchPattern the regex pattern to search for
		 * @param replacement the text to use as replacement
		 * @return Element — the current element
		 */
		public replaceText(searchPattern:string, replacement:string):Element;
		
		
		/**
		 * Sets the element's attributes.
		 * @param attributes the element's attributes
		 * @return ContainerElement — the current element
		 */
		public setAttributes(attributes:Object):ContainerElement;
		
		
		/**
		 * Sets the link url.
		 * @param url the link url
		 * @return ContainerElement — the current element
		 */
		public setLinkUrl(url:string):ContainerElement;
		
		
		/**
		 * Sets the text alignment. The available types of alignment are
		 *  DocumentApp.TextAlignment.NORMAL, DocumentApp.TextAlignment.SUBSCRIPT, and
		 *  DocumentApp.TextAlignment.SUPERSCRIPT.
		 * @param textAlignment the type of text alignment to apply
		 * @return ContainerElement — the current element
		 */
		public setTextAlignment(textAlignment:TextAlignment):ContainerElement;
	}
	
	class Document {
		
		/**
		 * Adds a Bookmark at the given Position.
		 * @param position the position of the new bookmark
		 * @return Bookmark — the new bookmark
		 */
		public addBookmark(position: Position): Bookmark;
		
		
		/**
		 * Adds the given user to the list of editors for the Document. If the user was already
		 *  on the list of viewers, this method promotes the user out of the list of viewers.
		 * @param emailAddress the email address of the user to add
		 * @return Document — this Document, for chaining
		 */
		public addEditor(emailAddress: string): Document;
		
		
		/**
		 * Adds the given user to the list of editors for the Document. If the user was already
		 *  on the list of viewers, this method promotes the user out of the list of viewers.
		 * @param user a representation of the user to add
		 * @return Document — this Document, for chaining
		 */
		public addEditor(user: User): Document;
		
		
		/**
		 * Adds the given array of users to the list of editors for the Document. If any of the
		 *  users were already on the list of viewers, this method promotes them out of the list of
		 *  viewers.
		 * @param emailAddresses an array of email addresses of the users to add
		 * @return Document — this Document, for chaining
		 */
		public addEditors(emailAddresses: string[]): Document;
		
		
		/**
		 * Adds a document footer section, if none exists.
		 *
		 * @return FooterSection — the document footer
		 */
		public addFooter(): FooterSection;
		
		
		/**
		 * Adds a document header section, if none exists.
		 *
		 * @return HeaderSection — the document header
		 */
		public addHeader(): HeaderSection;
		
		
		/**
		 * Adds a new NamedRange, which is a Range that has a name and ID to allow
		 *  later retrieval. Names are not necessarily unique; several different ranges in the same
		 *  document may share the same name, much like a class in HTML. By contrast, IDs are unique within
		 *  the document, like an ID in HTML. Once a NamedRange has been added to a document, it
		 *  cannot be modified, only removed.
		 * @param name the name for the range, which does not need to be unique; range names must be at
		 *      least 1 character, and no more than 256 characters
		 * @param range the range of elements to associate with the name; the range can be
		 *      the active selection, a
		 *      search result, or manually constructed
		 *      with newRange()
		 * @return NamedRange — the new NamedRange
		 */
		public addNamedRange(name: string, range: Range): NamedRange;
		
		
		/**
		 * Adds the given user to the list of viewers for the Document. If the user was already
		 *  on the list of editors, this method has no effect.
		 * @param emailAddress the email address of the user to add
		 * @return Document — this Document, for chaining
		 */
		public addViewer(emailAddress: string): Document;
		
		
		/**
		 * Adds the given user to the list of viewers for the Document. If the user was already
		 *  on the list of editors, this method has no effect.
		 * @param user a representation of the user to add
		 * @return Document — this Document, for chaining
		 */
		public addViewer(user: User): Document;
		
		
		/**
		 * Adds the given array of users to the list of viewers for the Document. If any of the
		 *  users were already on the list of editors, this method has no effect for them.
		 * @param emailAddresses an array of email addresses of the users to add
		 * @return Document — this Document, for chaining
		 */
		public addViewers(emailAddresses: string[]): Document;
		
		
		/**
		 * Retrieves the current Document contents as a blob of the specified
		 *  type.
		 * @param contentType the MIME type to convert to; currently only 'application/pdf' is
		 *      supported
		 * @return Blob — the current document as a blob
		 */
		public getAs(contentType: string): Blob;
		
		
		/**
		 * Retrieves the current Document contents as a blob.
		 *
		 * @return Blob — the current document as a blob
		 */
		public getBlob(): Blob;
		
		
		/**
		 * Retrieves the active document's Body.
		 *
		 * @return Body — the active document body section
		 */
		public getBody(): Body;
		
		
		/**
		 * Gets the Bookmark with the given ID. This method returns null if no such
		 *  Bookmark exists.
		 * @param id the ID for the Bookmark
		 * @return Bookmark — the Bookmark with the given ID, or null if no such Bookmark
		 *      exists
		 */
		public getBookmark(id: string): Bookmark;
		
		
		/**
		 * Gets all Bookmark objects in the document.
		 *
		 * @return Bookmark[] — an array of the Bookmark objects in the document
		 */
		public getBookmarks(): Bookmark[];
		
		
		/**
		 * Gets the user's cursor in the active document. A script can only access the cursor of the user
		 *  who is running the script, and only if the script is
		 *  bound to the document.
		 *
		 * @return Position — a representation of the user's cursor, or null if the user does not have a
		 *      cursor placed in the document or if the script is not bound to the document
		 */
		public getCursor(): Position;
		
		
		/**
		 * Gets the list of editors for this Document. If the user who executes the script does
		 *  not have edit access to the Document, this method throws an exception.
		 *
		 * @return User[] — an array of users with edit permission
		 */
		public getEditors(): User[];
		
		
		/**
		 * Retrieves the document's footer section, if one exists.
		 *
		 * @return FooterSection — the document footer
		 */
		public getFooter(): FooterSection;
		
		
		/**
		 * Retrieves all the Footnote elements in the document body.
		 *
		 * @return Footnote[] — the document footnotes
		 */
		public getFootnotes(): Footnote[];
		
		
		/**
		 * Retrieves the document's header section, if one exists.
		 *
		 * @return HeaderSection — the document header
		 */
		public getHeader(): HeaderSection;
		
		
		/**
		 * Retrieves the document's unique identifier. The document ID is used
		 *  with DocumentApp.openById() to open a specific document instance.
		 *
		 * @return string — the document's ID
		 */
		public getId(): string;
		
		
		/**
		 * Retrieves the title of the document.
		 *
		 * @return string — the document title
		 */
		public getName(): string;
		
		
		/**
		 * Gets the NamedRange with the given ID. This method returns null if no such
		 *  NamedRange exists. Names are not necessarily unique; several different ranges in the
		 *  same document may share the same name, much like a class in HTML. By contrast, IDs are unique
		 *  within the document, like an ID in HTML.
		 * @param id the range's ID, which is unique within the document
		 * @return NamedRange — the NamedRange with the given ID, or null if no such range exists
		 */
		public getNamedRangeById(id: string): NamedRange;
		
		
		/**
		 * Gets all NamedRange objects in the document.
		 *
		 * @return NamedRange[] — an array of the NamedRange objects in the document, possibly including multiple
		 *      ranges with the same name
		 */
		public getNamedRanges(): NamedRange[];
		
		
		/**
		 * Gets all NamedRange objects in the document with the given name. Names are not
		 *  necessarily unique; several different ranges in the same document may share the same name, much
		 *  like a class in HTML. By contrast, IDs are unique within the document, like an ID in HTML.
		 * @param name the range's name, which is not necessarily unique
		 * @return NamedRange[] — an array of the NamedRange objects in the document with the given name
		 */
		public getNamedRanges(name: string): NamedRange[];
		
		
		/**
		 * Gets the user's selection in the active document. A script can only access the selection of the
		 *  user who is running the script, and only if the script is
		 *  bound to the document.
		 *
		 * @return Range — a representation of the user's selection, or null if the user does not have
		 *      anything selected in the document or if the script is not bound to the document
		 */
		public getSelection(): Range;
		
		
		/**
		 * Retrieves the URL to access the current document.
		 *
		 * @return string — the URL to access the current document
		 */
		public getUrl(): string;
		
		
		/**
		 * Gets the list of viewers and commenters for this Document.  If the user who executes
		 *  the script does not have edit access to the Document, this method throws an exception.
		 *
		 * @return User[] — an array of users with view or comment permission
		 */
		public getViewers(): User[];
		
		
		/**
		 * Creates a new Position, which is a reference to a location in the document,
		 *  relative to a specific element. The user's cursor is represented as a Position, among
		 *  other uses.
		 * @param element the element that will contain the new Position; this must be either a
		 *      Text element or a container element like Paragraph
		 * @param offset for Text elements, the number of characters before the Position;
		 *      for other elements, the number of child elements before the Position within the
		 *      same container element
		 * @return Position — the new Position
		 */
		public newPosition(element: Element, offset: Integer): Position;
		
		
		/**
		 * Creates a builder used to construct Range objects from document elements.
		 *
		 * @return RangeBuilder — the new builder
		 */
		public newRange(): RangeBuilder;
		
		
		/**
		 * Removes the given user from the list of editors for the Document. This method does not
		 *  block users from accessing the Document if they belong to a class of users who have
		 *  general access — for example, if the Document is shared with the user's entire domain.
		 * @param emailAddress the email address of the user to remove
		 * @return Document — this Document, for chaining
		 */
		public removeEditor(emailAddress: string): Document;
		
		
		/**
		 * Removes the given user from the list of editors for the Document. This method does not
		 *  block users from accessing the Document if they belong to a class of users who have
		 *  general access — for example, if the Document is shared with the user's entire domain.
		 * @param user a representation of the user to remove
		 * @return Document — this Document, for chaining
		 */
		public removeEditor(user: User): Document;
		
		
		/**
		 * Removes the given user from the list of viewers and commenters for the Document.  This
		 *  method has no effect if the user is an editor, not a viewer or commenter. This method also does
		 *  not block users from accessing the Document if they belong to a class of users who
		 *  have general access — for example, if the Document is shared with the user's entire
		 *  domain.
		 * @param emailAddress the email address of the user to remove
		 * @return Document — this Document for chaining
		 */
		public removeViewer(emailAddress: string): Document;
		
		
		/**
		 * Removes the given user from the list of viewers and commenters for the Document.  This
		 *  method has no effect if the user is an editor, not a viewer. This method also does not block
		 *  users from accessing the Document if they belong to a class of users who have general
		 *  access — for example, if the Document is shared with the user's entire domain.
		 * @param user a representation of the user to remove
		 * @return Document — this Document for chaining
		 */
		public removeViewer(user: User): Document;
		
		
		/**
		 * Saves the current Document. Causes pending updates to be flushed
		 *  and applied.
		 */
		public saveAndClose();
		
		
		/**
		 * Sets the user's cursor in the active document, given a Position. A script can only
		 *  access the cursor of the user who is running the script, and only if the script is
		 *  bound to the document.
		 * @param position the new cursor location
		 * @return Document — this Document, for chaining
		 */
		public setCursor(position: Position): Document;
		
		
		/**
		 * Sets the document title.
		 * @param name the new document title
		 * @return Document — the current document
		 */
		public setName(name: string): Document;
		
		
		/**
		 * Sets the user's selection in the active document, given a Range. A script can
		 *  only access the selection of the user who is running the script, and only if the script is
		 *  bound to the document.
		 * @param range the new range of elements to select
		 * @return Document — this Document, for chaining
		 */
		public setSelection(range: Range): Document;
		
	}
	
	class Element {
		/**
		 * Returns the current element as a Body.
		 *
		 * @return Body — the current element
		 */
		public asBody(): Body;
		
		
		/**
		 * Returns the current element as a Equation.
		 *
		 * @return Equation — the current element
		 */
		public asEquation(): Equation;
		
		
		/**
		 * Returns the current element as a EquationFunction.
		 *
		 * @return EquationFunction — the current element
		 */
		public asEquationFunction(): EquationFunction;
		
		
		/**
		 * Returns the current element as a
		 *  EquationFunctionArgumentSeparator.
		 *
		 * @return EquationFunctionArgumentSeparator — the current element
		 */
		public asEquationFunctionArgumentSeparator(): EquationFunctionArgumentSeparator;
		
		
		/**
		 * Returns the current element as a EquationSymbol.
		 *
		 * @return EquationSymbol — the current element
		 */
		public asEquationSymbol(): EquationSymbol;
		
		
		/**
		 * Returns the current element as a FooterSection.
		 *
		 * @return FooterSection — the current element
		 */
		public asFooterSection(): FooterSection;
		
		
		/**
		 * Returns the current element as a Footnote.
		 *
		 * @return Footnote — the current element
		 */
		public asFootnote(): Footnote;
		
		
		/**
		 * Returns the current element as a FootnoteSection.
		 *
		 * @return FootnoteSection — the current element
		 */
		public asFootnoteSection(): FootnoteSection;
		
		
		/**
		 * Returns the current element as a HeaderSection.
		 *
		 * @return HeaderSection — the current element
		 */
		public asHeaderSection(): HeaderSection;
		
		
		/**
		 * Returns the current element as a HorizontalRule.
		 *
		 * @return HorizontalRule — the current element
		 */
		public asHorizontalRule(): HorizontalRule;
		
		
		/**
		 * Returns the current element as a InlineDrawing.
		 *
		 * @return InlineDrawing — the current element
		 */
		public asInlineDrawing(): InlineDrawing;
		
		
		/**
		 * Returns the current element as a InlineImage.
		 *
		 * @return InlineImage — the current element
		 */
		public asInlineImage(): InlineImage;
		
		
		/**
		 * Returns the current element as a ListItem.
		 *
		 * @return ListItem — the current element
		 */
		public asListItem(): ListItem;
		
		
		/**
		 * Returns the current element as a PageBreak.
		 *
		 * @return PageBreak — the current element
		 */
		public asPageBreak(): PageBreak;
		
		
		/**
		 * Returns the current element as a Paragraph.
		 *
		 * @return Paragraph — the current element
		 */
		public asParagraph(): Paragraph;
		
		
		/**
		 * Returns the current element as a Table.
		 *
		 * @return Table — the current element
		 */
		public asTable(): Table;
		
		
		/**
		 * Returns the current element as a TableCell.
		 *
		 * @return TableCell — the current element
		 */
		public asTableCell(): TableCell;
		
		
		/**
		 * Returns the current element as a TableOfContents.
		 *
		 * @return TableOfContents — the current element
		 */
		public asTableOfContents(): TableOfContents;
		
		
		/**
		 * Returns the current element as a TableRow.
		 *
		 * @return TableRow — the current element
		 */
		public asTableRow(): TableRow;
		
		
		/**
		 * Returns the current element as a Text.
		 *
		 * @return Text — the current element
		 */
		public asText(): Text;
		
		
		/**
		 * Returns a detached, deep copy of the current element.
		 *
		 * @return Element — the new copy
		 */
		public copy(): Element;
		
		
		/**
		 * Retrieves the element's attributes.
		 *
		 * @return any — the element's attributes
		 */
		public getAttributes(): any;
		
		
		/**
		 * Retrieves the element's next sibling element.
		 *
		 * @return Element — the next sibling element
		 */
		public getNextSibling(): Element;
		
		
		/**
		 * Retrieves the element's parent element.
		 *
		 * @return ContainerElement — the parent element
		 */
		public getParent(): ContainerElement;
		
		
		/**
		 * Retrieves the element's previous sibling element.
		 *
		 * @return Element — the previous sibling element
		 */
		public getPreviousSibling(): Element;
		
		
		/**
		 * Retrieves the element's ElementType.
		 *
		 * @return ElementType — the element type
		 */
		public getType(): ElementType;
		
		
		/**
		 * Determines whether the element is at the end of the
		 *  Document.
		 *
		 * @return boolean — whether the element is at the end of the document
		 */
		public isAtDocumentEnd(): boolean;
		
		
		/**
		 * Merges the element with the preceding sibling of the same type.
		 *
		 * @return Element — the merged element
		 */
		public merge(): Element;
		
		
		/**
		 * Removes the element from its parent.
		 *
		 * @return Element — the removed element
		 */
		public removeFromParent(): Element;
		
		
		/**
		 * Sets the element's attributes.
		 * @param attributes the element's attributes
		 * @return Element — the current element
		 */
		public setAttributes(attributes: any): Element;
	}
	
	type ElementType = string;
	namespace ElementType {
		/**
		 * The type corresponding to the Body element.
		 */
		const BODY_SECTION:ElementType;
		
		/**
		 * The type corresponding to the CommentSection element.
		 */
		const COMMENT_SECTION:ElementType;
		
		/**
		 * The type that corresponds to the root of the document.
		 */
		const DOCUMENT:ElementType;
		
		/**
		 * The type corresponding to the Equation element.
		 */
		const EQUATION:ElementType;
		
		/**
		 * The type corresponding to the EquationFunction element.
		 */
		const EQUATION_FUNCTION:ElementType;
		
		/**
		 * The type corresponding to the EquationFunctionArgumentSeparator element.
		 */
		const EQUATION_FUNCTION_ARGUMENT_SEPARATOR:ElementType;
		
		/**
		 * The type corresponding to the EquationSymbol element.
		 */
		const EQUATION_SYMBOL:ElementType;
		
		/**
		 * The type corresponding to the FooterSection element.
		 */
		const FOOTER_SECTION:ElementType;
		
		/**
		 * The type corresponding to the Footnote element.
		 */
		const FOOTNOTE:ElementType;
		
		/**
		 * The type corresponding to the FootnoteSection element.
		 */
		const FOOTNOTE_SECTION:ElementType;
		
		/**
		 * The type corresponding to the HeaderSection element.
		 */
		const HEADER_SECTION:ElementType;
		
		/**
		 * The type corresponding to the HorizontalRule element.
		 */
		const HORIZONTAL_RULE:ElementType;
		
		/**
		 * The type corresponding to the InlineDrawing element.
		 */
		const INLINE_DRAWING:ElementType;
		
		/**
		 * The type corresponding to the InlineImage element.
		 */
		const INLINE_IMAGE:ElementType;
		
		/**
		 * The type corresponding to the ListItem element.
		 */
		const LIST_ITEM:ElementType;
		
		/**
		 * The type corresponding to the PageBreak element.
		 */
		const PAGE_BREAK:ElementType;
		
		/**
		 * The type corresponding to the Paragraph element.
		 */
		const PARAGRAPH:ElementType;
		
		/**
		 * The type corresponding to the Table element.
		 */
		const TABLE:ElementType;
		
		/**
		 * The type corresponding to the TableCell element.
		 */
		const TABLE_CELL:ElementType;
		
		/**
		 * The type corresponding to the TableOfContents element.
		 */
		const TABLE_OF_CONTENTS:ElementType;
		
		/**
		 * The type corresponding to the TableRow element.
		 */
		const TABLE_ROW:ElementType;
		
		/**
		 * The type corresponding to the Text element.
		 */
		const TEXT:ElementType;
		
		/**
		 * The type corresponding to UnsupportedElement. Unsupported elements represent document portions that do not support scripting.
		 */
		const UNSUPPORTED:ElementType;
	}
	
	class Equation{}
	class EquationFunction{}
	class EquationFunctionArgumentSeparator{}
	class EquationSymbol{}
	class FooterSection {}
	class Footnote{}
	class FootnoteSection{}
	class HeaderSection {}
	class HorizontalAlignment {}
	class HorizontalRule{}
	class InlineDrawing{}
	class InlineImage{}
	class ListItem{}
	class NamedRange{}
	class PageBreak{}
	
	class Paragraph extends ContainerElement {
		/**
		 * Creates and inserts a new PositionedImage from the specified image
		 *  blob.
		 * @param image the image data
		 * @return PositionedImage — the new positioned image
		 */
		public addPositionedImage(image:BlobSource):PositionedImage;
		
		
		/**
		 * Creates and appends a new HorizontalRule.
		 *
		 * @return HorizontalRule — the new horizontal rule
		 */
		public appendHorizontalRule():HorizontalRule;
		
		
		/**
		 * Creates and appends a new InlineImage from the specified image
		 *  blob.
		 * @param image the image data
		 * @return InlineImage — the appended image
		 */
		public appendInlineImage(image:BlobSource):InlineImage;
		
		
		/**
		 * Appends the given InlineImage.
		 * @param image the image data
		 * @return InlineImage — the appended image
		 */
		public appendInlineImage(image:InlineImage):InlineImage;
		
		
		/**
		 * Creates and appends a new PageBreak.
		 *
		 * @return PageBreak — the new page break element
		 */
		public appendPageBreak():PageBreak;
		
		
		/**
		 * Appends the given PageBreak.
		 * @param pageBreak the page break to append
		 * @return PageBreak — the appended page break element
		 */
		public appendPageBreak(pageBreak:PageBreak):PageBreak;
		
		
		/**
		 * Creates and appends a new Text element with the specified
		 *  contents.
		 * @param text the text contents
		 * @return Text — the new text element
		 */
		public appendText(text:string):Text;
		
		
		/**
		 * Appends the given Text element.
		 * @param text the text element to append
		 * @return Text — the appended text element
		 */
		public appendText(text:Text):Text;
		
		
		/**
		 * Clears the contents of the element.
		 *
		 * @return Paragraph — the current element
		 */
		public clear():Paragraph;
		
		
		/**
		 * Returns a detached, deep copy of the current element.
		 *
		 * @return Paragraph — the new copy
		 */
		public copy():Paragraph;
		
		
		/**
		 * Obtains a Text version of the current element, for editing.
		 *
		 * @return Text — a text version of the current element
		 */
		public editAsText():Text;
		
		
		/**
		 * Searches the contents of the element for a descendant of the specified
		 *  type.
		 * @param elementType the type of element to search for
		 * @return RangeElement — a search result indicating the position of the search element
		 */
		public findElement(elementType:ElementType):RangeElement;
		
		
		/**
		 * Searches the contents of the element for a descendant of the specified
		 *  type, starting from the specified RangeElement.
		 * @param elementType the type of element to search for
		 * @param from the search result to search from
		 * @return RangeElement — a search result indicating the next position of the search element
		 */
		public findElement(elementType:ElementType, from:RangeElement):RangeElement;
		
		
		/**
		 * Searches the contents of the element for the specified text pattern using
		 *  regular expressions.
		 * @param searchPattern the pattern to search for
		 * @return RangeElement — a search result indicating the position of the search text, or null
		 *      if there is no match
		 */
		public findText(searchPattern:string):RangeElement;
		
		
		/**
		 * Searches the contents of the element for the specified text pattern,
		 *  starting from a given search result.
		 * @param searchPattern the pattern to search for
		 * @param from the search result to search from
		 * @return RangeElement — a search result indicating the next position of the search text, or
		 *      null if there is no match
		 */
		public findText(searchPattern:string, from:RangeElement):RangeElement;
		
		
		/**
		 * Retrieves the HorizontalAlignment.
		 *
		 * @return HorizontalAlignment — the alignment
		 */
		public getAlignment():HorizontalAlignment;
		
		
		/**
		 * Retrieves the element's attributes.
		 *
		 * @return any — the element's attributes
		 */
		public getAttributes():any;
		
		
		/**
		 * Retrieves the child element at the specified child index.
		 * @param childIndex the index of the child element to retrieve
		 * @return Element — the child element at the specified index
		 */
		public getChild(childIndex:Integer):Element;
		
		
		/**
		 * Retrieves the child index for the specified child element.
		 * @param child the child element for which to retrieve the index
		 * @return Integer — the child index
		 */
		public getChildIndex(child:Element):Integer;
		
		
		/**
		 * Retrieves the ParagraphHeading.
		 *
		 * @return ParagraphHeading — the heading
		 */
		public getHeading():ParagraphHeading;
		
		
		/**
		 * Retrieves the end indentation, in points.
		 *
		 * @return number — the end indentation, in points
		 */
		public getIndentEnd():number;
		
		
		/**
		 * Retrieves the first line indentation, in points.
		 *
		 * @return number — the first line indentation, in points
		 */
		public getIndentFirstLine():number;
		
		
		/**
		 * Retrieves the start indentation.
		 *
		 * @return number — the start indentation
		 */
		public getIndentStart():number;
		
		
		/**
		 * Retrieves the line spacing, in points.
		 *
		 * @return number — the line spacing, in points
		 */
		public getLineSpacing():number;
		
		
		/**
		 * Retrieves the link url.
		 *
		 * @return string — the link url, or null if the element contains multiple values
		 *      for this attribute
		 */
		public getLinkUrl():string;
		
		
		/**
		 * Retrieves the element's next sibling element.
		 *
		 * @return Element — the next sibling element
		 */
		public getNextSibling():Element;
		
		
		/**
		 * Retrieves the number of children.
		 *
		 * @return Integer — the number of children
		 */
		public getNumChildren():Integer;
		
		
		/**
		 * Retrieves the element's parent element.
		 *
		 * @return ContainerElement — the parent element
		 */
		public getParent():ContainerElement;
		
		
		/**
		 * Gets a PositionedImage by the image's ID.
		 * @param id the image id
		 * @return PositionedImage — the positioned image
		 */
		public getPositionedImage(id:string):PositionedImage;
		
		
		/**
		 * Gets all PositionedImage objects anchored to the paragraph.
		 *
		 * @return PositionedImage[] — a list of positioned images
		 */
		public getPositionedImages():PositionedImage[];
		
		
		/**
		 * Retrieves the element's previous sibling element.
		 *
		 * @return Element — the previous sibling element
		 */
		public getPreviousSibling():Element;
		
		
		/**
		 * Retrieves the spacing after the element, in points.
		 *
		 * @return number — the spacing after the element, in points
		 */
		public getSpacingAfter():number;
		
		
		/**
		 * Retrieves the spacing before the element, in points.
		 *
		 * @return number — the spacing before the element, in points
		 */
		public getSpacingBefore():number;
		
		
		/**
		 * Retrieves the contents of the element as a text string.
		 *
		 * @return string — the contents of the element as text string
		 */
		public getText():string;
		
		
		/**
		 * Gets the text alignment. The available types of alignment are
		 *  DocumentApp.TextAlignment.NORMAL, DocumentApp.TextAlignment.SUBSCRIPT, and
		 *  DocumentApp.TextAlignment.SUPERSCRIPT.
		 *
		 * @return TextAlignment — the type of text alignment, or null if the text contains multiple types of
		 *      text alignments or if the text alignment has never been set
		 */
		public getTextAlignment():TextAlignment;
		
		
		/**
		 * Retrieves the element's ElementType.
		 *
		 * @return ElementType — the element type
		 */
		public getType():ElementType;
		
		
		/**
		 * Creates and inserts a HorizontalRule at the specified index.
		 * @param childIndex the index at which to insert the element
		 * @return HorizontalRule — the new horizontal rule element
		 */
		public insertHorizontalRule(childIndex:Integer):HorizontalRule;
		
		
		/**
		 * Creates and inserts a new InlineImage from the specified image
		 *  blob, at the specified index.
		 * @param childIndex the index at which to insert the element
		 * @param image the image data
		 * @return InlineImage — the inserted inline image element
		 */
		public insertInlineImage(childIndex:Integer, image:BlobSource):InlineImage;
		
		
		/**
		 * Inserts the given InlineImage at the specified index.
		 * @param childIndex the index at which to insert the element
		 * @param image the image data
		 * @return InlineImage — the inserted inline image element
		 */
		public insertInlineImage(childIndex:Integer, image:InlineImage):InlineImage;
		
		
		/**
		 * Creates and inserts a new PageBreak at the specified index.
		 * @param childIndex the index at which to insert the element
		 * @return PageBreak — the new page break element
		 */
		public insertPageBreak(childIndex:Integer):PageBreak;
		
		
		/**
		 * Inserts the given PageBreak at the specified index.
		 * @param childIndex the index at which to insert the element
		 * @param pageBreak the p[age break to insert
		 * @return PageBreak — the inserted page break element
		 */
		public insertPageBreak(childIndex:Integer, pageBreak:PageBreak):PageBreak;
		
		
		/**
		 * Creates and inserts a new text element at the specified index.
		 * @param childIndex the index at which to insert the element
		 * @param text the text contents
		 * @return Text — the new text element
		 */
		public insertText(childIndex:Integer, text:string):Text;
		
		
		/**
		 * Inserts the given Text element at the specified index, with the
		 *  specified text contents.
		 * @param childIndex the index at which to insert the element
		 * @param text the text element to insert
		 * @return Text — the inserted text element
		 */
		public insertText(childIndex:Integer, text:Text):Text;
		
		
		/**
		 * Determines whether the element is at the end of the
		 *  Document.
		 *
		 * @return boolean — whether the element is at the end of the document
		 */
		public isAtDocumentEnd():boolean;
		
		
		/**
		 * Retrieves the left-to-right setting.
		 *
		 * @return boolean — the left-to-right setting
		 */
		public isLeftToRight():boolean;
		
		
		/**
		 * Merges the element with the preceding sibling of the same type.
		 *
		 * @return Paragraph — the merged element
		 */
		public merge():Paragraph;
		
		
		/**
		 * Removes the specified child element.
		 * @param child the child element to remove
		 * @return Paragraph — the current element
		 */
		public removeChild(child:Element):Paragraph;
		
		
		/**
		 * Removes the element from its parent.
		 *
		 * @return Paragraph — the removed element
		 */
		public removeFromParent():Paragraph;
		
		
		/**
		 * Removes a PositionedImage by the image's ID.
		 * @param id the image id
		 * @return boolean — whether or not the specified image was removed
		 */
		public removePositionedImage(id:string):boolean;
		
		
		/**
		 * Replaces all occurrences of a given text pattern with a given replacement
		 *  string, using regular expressions.
		 * @param searchPattern the regex pattern to search for
		 * @param replacement the text to use as replacement
		 * @return Element — the current element
		 */
		public replaceText(searchPattern:string, replacement:string):Element;
		
		
		/**
		 * Sets the HorizontalAlignment.
		 * @param alignment the horizontal alignment
		 * @return Paragraph — the current element
		 */
		public setAlignment(alignment:HorizontalAlignment):Paragraph;
		
		
		/**
		 * Sets the element's attributes.
		 * @param attributes the element's attributes
		 * @return Paragraph — the current element
		 */
		public setAttributes(attributes:any):Paragraph;
		
		
		/**
		 * Sets the ParagraphHeading.
		 * @param heading the heading
		 * @return Paragraph — the current element
		 */
		public setHeading(heading:ParagraphHeading):Paragraph;
		
		
		/**
		 * Sets the end indentation, in points.
		 * @param indentEnd the end indentation, in points
		 * @return Paragraph — the current element
		 */
		public setIndentEnd(indentEnd:number):Paragraph;
		
		
		/**
		 * Sets the first line indentation, in points.
		 * @param indentFirstLine the first line indentation, in points
		 * @return Paragraph — the current element
		 */
		public setIndentFirstLine(indentFirstLine:number):Paragraph;
		
		
		/**
		 * Sets the start indentation, in points.
		 * @param indentStart the start indentation, in points
		 * @return Paragraph — the current element
		 */
		public setIndentStart(indentStart:number):Paragraph;
		
		
		/**
		 * Sets the left-to-right setting.
		 * @param leftToRight the left-to-right setting
		 * @return Paragraph — the current element
		 */
		public setLeftToRight(leftToRight:boolean):Paragraph;
		
		
		/**
		 * Sets the line spacing, as a quantity indicating the number of lines to use
		 *  for spacing.
		 * @param multiplier the number of lines
		 * @return Paragraph — the current element
		 */
		public setLineSpacing(multiplier:number):Paragraph;
		
		
		/**
		 * Sets the link url.
		 * @param url the link url
		 * @return Paragraph — the current element
		 */
		public setLinkUrl(url:string):Paragraph;
		
		
		/**
		 * Sets the spacing after the element, in points.
		 * @param spacingAfter the spacing after the element, in points
		 * @return Paragraph — the current element
		 */
		public setSpacingAfter(spacingAfter:number):Paragraph;
		
		
		/**
		 * Sets the spacing before the element, in points.
		 * @param spacingBefore the spacing before the element, in points
		 * @return Paragraph — the current element
		 */
		public setSpacingBefore(spacingBefore:number):Paragraph;
		
		
		/**
		 * Sets the contents of the paragraph as text.
		 * @param text the new text contents
		 */
		public setText(text:string):void;
		
		
		/**
		 * Sets the text alignment. The available types of alignment are
		 *  DocumentApp.TextAlignment.NORMAL, DocumentApp.TextAlignment.SUBSCRIPT, and
		 *  DocumentApp.TextAlignment.SUPERSCRIPT.
		 * @param textAlignment the type of text alignment to apply
		 * @return Paragraph — the current element
		 */
		public setTextAlignment(textAlignment:TextAlignment):Paragraph;
	}
	
	type ParagraphHeading = string;
	namespace ParagraphHeading {
		/**
		 * The heading option for normal text.
		 */
		const NORMAL:ParagraphHeading;
		
		/**
		 * The highest heading option.
		 */
		const HEADING1:ParagraphHeading;
		
		/**
		 * The second heading option.
		 */
		const HEADING2:ParagraphHeading;
		
		/**
		 * The third heading option
		 */
		const HEADING3:ParagraphHeading;
		
		/**
		 * The fourth heading option.
		 */
		const HEADING4:ParagraphHeading;
		
		/**
		 * The fifth heading option.
		 */
		const HEADING5:ParagraphHeading;
		
		/**
		 * The lowest heading option.
		 */
		const HEADING6:ParagraphHeading;
		
		/**
		 * The title heading option.
		 */
		const TITLE:ParagraphHeading;
		
		/**
		 * The subtitle heading option.
		 */
		const SUBTITLE:ParagraphHeading;
	}
	
	class Position {
		
		/**
		 * Gets the element that contains this Position. This will be either a Text
		 *  element or a container element like
		 *  Paragraph. In either case, the
		 *  relative position within the element can be determined with getOffset().
		 *
		 * @return Element — the container or Text element in which this Position any is located
		 */
		public getElement(): Element;
		
		
		/**
		 * Gets this Position's relative location within the element that contains it. If the
		 *  element is a Text element, the offset is the number of characters before the
		 *  Position (that is, the index of the character after this Position); for any
		 *  other element, the offset is the number of child elements before this Position within
		 *  the same container element (that is, the index of the child element after the
		 *  Position).
		 *
		 * @return Integer — for Text elements, the number of characters before this Position; for
		 *      other elements, the number of child elements before this Position within the same
		 *      container element
		 */
		public getOffset(): Integer;
		
		
		/**
		 * Creates an artificial Text element that represents the text and formatting of the
		 *  Paragraph or
		 *  ListItem that contains the
		 *  Position, either directly or through a chain of child elements. To determine the
		 *  Position's offset in the returned Text element, use
		 *  getSurroundingTextOffset().
		 *
		 * @return Text — an element equivalent to the result of calling
		 *      editAsText() on the Paragraph
		 *      or ListItem that contains the
		 *      Position, either directly or through a chain of child elements
		 */
		public getSurroundingText(): Text;
		
		
		/**
		 * Gets the offset of this Position within the Text element returned by
		 *  getSurroundingText(). The offset is the number of characters before the
		 *  Position (that is, the index of the character after this Position).
		 *
		 * @return Integer — the number of characters before this Position in the
		 *      Paragraph or
		 *      ListItem that contains the
		 *      Position, either directly or through a chain of child elements
		 */
		public getSurroundingTextOffset(): Integer;
		
		
		/**
		 * Creates and inserts a new Bookmark at this Position.
		 *
		 * @return Bookmark — the new bookmark
		 */
		public insertBookmark(): Bookmark;
		
		
		/**
		 * Creates and inserts a new InlineImage at this Position from the specified image
		 *  blob.
		 * @param image the image data to insert at this Position
		 * @return InlineImage — the new image element, or null if the element in which this Position is
		 *      located does not allow images to be inserted
		 */
		public insertInlineImage(image: BlobSource): InlineImage;
		
		
		/**
		 * Inserts the specified text at this Position. This method creates a new Text
		 *  element, even if the string is inserted within an existing Text element, so that it is
		 *  easy to style the new element.
		 * @param text the string to insert at this Position
		 * @return Text — the new text element, or null if the element in which this Position is
		 *      located does not allow text to be inserted
		 */
		public insertText(text: string): Text;
		
	}
	
	class PositionedImage {}
	
	class Range {}
	
	class RangeBuilder {
		
		/**
		 * Adds an entire Element to this RangeBuilder.
		 * @param element the element to be added
		 * @return RangeBuilder — this builder, for chaining
		 */
		public addElement(element:Element):RangeBuilder;
		
		
		/**
		 * Adds a partial Text element to this RangeBuilder.
		 * @param textElement the text element to be partially added
		 * @param startOffset the number of characters before the first character to be included (that is,
		 *      the index of the first character in the range)
		 * @param endOffsetInclusive the number of characters before the last character to be included
		 *      (that is, the index of the last character in the range)
		 * @return RangeBuilder — this builder, for chaining
		 */
		public addElement(textElement:Text, startOffset:Integer, endOffsetInclusive:Integer):RangeBuilder;
		
		
		/**
		 * Adds two entire elements, and all elements between them, to this RangeBuilder.
		 * @param startElement the first element to be added
		 * @param endElementInclusive the last element to be added
		 * @return RangeBuilder — this builder, for chaining
		 */
		public addElementsBetween(startElement:Element, endElementInclusive:Element):RangeBuilder;
		
		
		/**
		 * Adds two partial Text elements, and all elements between them, to the
		 *  RangeBuilder.
		 * @param startTextElement the first text element to be partially added
		 * @param startOffset the number of characters before the first character of
		 *      startTextElement to be included (that is, the index of the first character in the
		 *      range)
		 * @param endTextElementInclusive the last text element to be partially added
		 * @param endOffsetInclusive the number of characters before the last character of
		 *      endTextElementInclusive to be included (that is, the index of the last character in
		 *      the range)
		 * @return RangeBuilder — this builder, for chaining
		 */
		public addElementsBetween(startTextElement:Text, startOffset:Integer, endTextElementInclusive:Text, endOffsetInclusive:Integer):RangeBuilder;
		
		
		/**
		 * Adds the contents of another Range to this RangeBuilder.
		 * @param range the range whose elements should be added
		 * @return RangeBuilder — this builder, for chaining
		 */
		public addRange(range:Range):RangeBuilder;
		
		
		/**
		 * Constructs a Range from the settings applied to the builder.
		 *
		 * @return Range — the newly constructed range
		 */
		public build():Range;
		
		
		/**
		 * Gets all elements in this Range, including any partial
		 *  Text elements (for example, in the
		 *  case of a selection that includes only part of a Text element). To determine whether a
		 *  Text element is only partially included in the range, see
		 *  RangeElement.isPartial().
		 *
		 * @return RangeElement[] — an array of elements, in the order they appear in the document
		 */
		public getRangeElements():RangeElement[];
		
	}
	
	class RangeElement {}
	class Table {}
	class TableCell{}
	class TableOfContents{}
	class TableRow {}
	
	class Text extends Element {
		/**
		 * Appends the specified text at the given character offset.
		 * @param text the text to append
		 * @return Text — the current element
		 */
		public appendText(text:string):Text;
		
		
		/**
		 * Returns a detached, deep copy of the current element.
		 *
		 * @return Text — the new copy
		 */
		public copy():Text;
		
		
		/**
		 * Deletes a range of text.
		 * @param startOffset the character offset of the first character to delete
		 * @param endOffsetInclusive the character offset of the last character to delete
		 * @return Text — the current element
		 */
		public deleteText(startOffset:Integer, endOffsetInclusive:Integer):Text;
		
		
		/**
		 * Obtains a Text version of the current element, for editing.
		 *
		 * @return Text — a text version of the current element
		 */
		public editAsText():Text;
		
		
		/**
		 * Searches the contents of the element for the specified text pattern using
		 *  regular expressions.
		 * @param searchPattern the pattern to search for
		 * @return RangeElement — a search result indicating the position of the search text, or null
		 *      if there is no match
		 */
		public findText(searchPattern:string):RangeElement;
		
		
		/**
		 * Searches the contents of the element for the specified text pattern,
		 *  starting from a given search result.
		 * @param searchPattern the pattern to search for
		 * @param from the search result to search from
		 * @return RangeElement — a search result indicating the next position of the search text, or
		 *      null if there is no match
		 */
		public findText(searchPattern:string, from:RangeElement):RangeElement;
		
		
		/**
		 * Retrieves the element's attributes.
		 *
		 * @return Object — the element's attributes
		 */
		public getAttributes():Object;
		
		
		/**
		 * Retrieves the attributes at the specified character offset.
		 * @param offset the character offset
		 * @return Object — the element's attributes
		 */
		public getAttributes(offset:Integer):Object;
		
		
		/**
		 * Retrieves the background color setting.
		 *
		 * @return string — the background color, formatted in CSS notation (like '#ffffff'), or null
		 *      if the element contains multiple values for this attribute
		 */
		public getBackgroundColor():string;
		
		
		/**
		 * Retrieves the background color at the specified character offset.
		 * @param offset the character offset
		 * @return string — the background color, formatted in CSS notation (like '#ffffff')
		 */
		public getBackgroundColor(offset:Integer):string;
		
		
		/**
		 * Retrieves the font family setting. The name can be any font from the Font
		 *  menu in Docs or
		 *  Google Fonts, and is
		 *  case-sensitive. The methods getFontFamily() and
		 *  setFontFamily(fontFamilyName) now use string names for fonts instead of
		 *  the FontFamily
		 *  enum. Although this enum is deprecated, it will remain available for
		 *  compatibility with older scripts.
		 *
		 * @return string — the font family, or null if the element contains multiple values
		 *      for this attribute
		 */
		public getFontFamily():string;
		
		
		/**
		 * Retrieves the font family at the specified character offset. The name
		 *  can be any font from the Font menu in Docs or
		 *  Google Fonts, and is
		 *  case-sensitive. The methods getFontFamily() and
		 *  setFontFamily(fontFamilyName) now use string names for fonts
		 *  instead of the
		 *  FontFamily enum.
		 *  Although this enum is deprecated, it will remain available for
		 *  compatibility with older scripts.
		 * @param offset the character offset
		 * @return string — the font family
		 */
		public getFontFamily(offset:Integer):string;
		
		
		/**
		 * Retrieves the font size setting.
		 *
		 * @return Integer — the font size, or null if the element contains multiple values
		 *      for this attribute
		 */
		public getFontSize():Integer;
		
		
		/**
		 * Retrieves the font size at the specified character offset.
		 * @param offset the character offset
		 * @return Integer — the font size
		 */
		public getFontSize(offset:Integer):Integer;
		
		
		/**
		 * Retrieves the foreground color setting.
		 *
		 * @return string — the foreground color, formatted in CSS notation (like '#ffffff'), or null
		 *      if the element contains multiple values for this attribute
		 */
		public getForegroundColor():string;
		
		
		/**
		 * Retrieves the foreground color at the specified character offset.
		 * @param offset the character offset
		 * @return string — the foreground color, formatted in CSS notation (like '#ffffff')
		 */
		public getForegroundColor(offset:Integer):string;
		
		
		/**
		 * Retrieves the link url.
		 *
		 * @return string — the link url, or null if the element contains multiple values
		 *      for this attribute
		 */
		public getLinkUrl():string;
		
		
		/**
		 * Retrieves the link url at the specified character offset.
		 * @param offset the character offset
		 * @return string — the link url
		 */
		public getLinkUrl(offset:Integer):string;
		
		
		/**
		 * Retrieves the element's next sibling element.
		 *
		 * @return Element — the next sibling element
		 */
		public getNextSibling():Element;
		
		
		/**
		 * Retrieves the element's parent element.
		 *
		 * @return ContainerElement — the parent element
		 */
		public getParent():ContainerElement;
		
		
		/**
		 * Retrieves the element's previous sibling element.
		 *
		 * @return Element — the previous sibling element
		 */
		public getPreviousSibling():Element;
		
		
		/**
		 * Retrieves the contents of the element as a text string.
		 *
		 * @return string — the contents of the element as text string
		 */
		public getText():string;
		
		
		/**
		 * Gets the text alignment. The available types of alignment are
		 *  DocumentApp.TextAlignment.NORMAL, DocumentApp.TextAlignment.SUBSCRIPT, and
		 *  DocumentApp.TextAlignment.SUPERSCRIPT.
		 *
		 * @return TextAlignment — the type of text alignment, or null if the text contains multiple types of
		 *      text alignments or if the text alignment has never been set
		 */
		public getTextAlignment():TextAlignment;
		
		
		/**
		 * Gets the text alignment for a single character. The available types of alignment are
		 *  DocumentApp.TextAlignment.NORMAL, DocumentApp.TextAlignment.SUBSCRIPT, and
		 *  DocumentApp.TextAlignment.SUPERSCRIPT.
		 * @param offset the offset of the character
		 * @return TextAlignment — the type of text alignment, or null if the text alignment has never been set
		 */
		public getTextAlignment(offset:Integer):TextAlignment;
		
		
		/**
		 * Retrieves the set of text indices that correspond to the start of
		 *  distinct text formatting runs.
		 *
		 * @return Integer[] — the set of text indices at which text formatting changes
		 */
		public getTextAttributeIndices():Integer[];
		
		
		/**
		 * Retrieves the element's ElementType.
		 *
		 * @return ElementType — the element type
		 */
		public getType():ElementType;
		
		
		/**
		 * Inserts the specified text at the given character offset.
		 * @param offset the character offset at which to insert
		 * @param text the text to insert
		 * @return Text — the current element
		 */
		public insertText(offset:Integer, text:string):Text;
		
		
		/**
		 * Determines whether the element is at the end of the
		 *  Document.
		 *
		 * @return boolean — whether the element is at the end of the document
		 */
		public isAtDocumentEnd():boolean;
		
		
		/**
		 * Retrieves the bold setting.
		 *
		 * @return boolean — whether the text is bold, or null if the element contains multiple
		 *      values for this attribute
		 */
		public isBold():boolean;
		
		
		/**
		 * Retrieves the bold setting at the specified character offset.
		 * @param offset the character offset
		 * @return boolean — the bold setting
		 */
		public isBold(offset:Integer):boolean;
		
		
		/**
		 * Retrieves the italic setting.
		 *
		 * @return boolean — whether the text is italic, or null if the element contains
		 *      multiple values for this attribute
		 */
		public isItalic():boolean;
		
		
		/**
		 * Retrieves the italic setting at the specified character offset.
		 * @param offset the character offset
		 * @return boolean — the italic setting
		 */
		public isItalic(offset:Integer):boolean;
		
		
		/**
		 * Retrieves the strikethrough setting.
		 *
		 * @return boolean — whether the text is strikethrough, or null if the element contains
		 *      multiple values for this attribute
		 */
		public isStrikethrough():boolean;
		
		
		/**
		 * Retrieves the strikethrough setting at the specified character offset.
		 * @param offset the character offset
		 * @return boolean — the strikethrough setting
		 */
		public isStrikethrough(offset:Integer):boolean;
		
		
		/**
		 * Retrieves the underline setting.
		 *
		 * @return boolean — whether the text is underlined, or null if the element contains
		 *    multiple values for this attribute
		 */
		public isUnderline():boolean;
		
		
		/**
		 * Retrieves the underline setting at the specified character offset.
		 * @param offset the character offset
		 * @return boolean — the underline setting
		 */
		public isUnderline(offset:Integer):boolean;
		
		
		/**
		 * Merges the element with the preceding sibling of the same type.
		 *
		 * @return Text — the merged element
		 */
		public merge():Text;
		
		
		/**
		 * Removes the element from its parent.
		 *
		 * @return Text — the removed element
		 */
		public removeFromParent():Text;
		
		
		/**
		 * Replaces all occurrences of a given text pattern with a given replacement
		 *  string, using regular expressions.
		 * @param searchPattern the regex pattern to search for
		 * @param replacement the text to use as replacement
		 * @return Element — the current element
		 */
		public replaceText(searchPattern:string, replacement:string):Element;
		
		
		/**
		 * Applies the specified attributes to the given character range.
		 * @param startOffset the text range's start offset
		 * @param endOffsetInclusive the text range's end offset
		 * @param attributes the element's attributes
		 * @return Text — the current element
		 */
		public setAttributes(startOffset:Integer, endOffsetInclusive:Integer, attributes:Object):Text;
		
		
		/**
		 * Sets the element's attributes.
		 * @param attributes the element's attributes
		 * @return Text — the current element
		 */
		public setAttributes(attributes:Object):Text;
		
		
		/**
		 * Sets the background color for the specified character range.
		 * @param startOffset the text range's start offset
		 * @param endOffsetInclusive the text range's end offset
		 * @param color the background color, formatted in CSS notation (like '#ffffff')
		 * @return Text — the current element
		 */
		public setBackgroundColor(startOffset:Integer, endOffsetInclusive:Integer, color:string):Text;
		
		
		/**
		 * Sets the background color.
		 * @param color the background color, formatted in CSS notation (like '#ffffff')
		 * @return Text — the current element
		 */
		public setBackgroundColor(color:string):Text;
		
		
		/**
		 * Sets the bold setting.
		 * @param bold the bold setting
		 * @return Text — the current element
		 */
		public setBold(bold:boolean):Text;
		
		
		/**
		 * Sets the bold setting for the specified character range.
		 * @param startOffset the text range's start offset
		 * @param endOffsetInclusive the text range's end offset
		 * @param bold the bold setting
		 * @return Text — the current element
		 */
		public setBold(startOffset:Integer, endOffsetInclusive:Integer, bold:boolean):Text;
		
		
		/**
		 * Sets the font family for the specified character range. The name can be any
		 *  font from the Font menu in Docs or
		 *  Google Fonts, and is
		 *  case-sensitive. Unrecognized font names will render as Arial. The
		 *  methods getFontFamily(offset) and
		 *  setFontFamily(fontFamilyName) now use string names for fonts
		 *  instead of the
		 *  FontFamily
		 *  enum. Although this enum is deprecated, it will remain available for
		 *  compatibility with older scripts.
		 * @param startOffset the text range's start offset
		 * @param endOffsetInclusive the text range's end offset
		 * @param fontFamilyName the name of the font family, from the Font menu in Docs or Google Fonts
		 * @return Text — the current element
		 */
		public setFontFamily(startOffset:Integer, endOffsetInclusive:Integer, fontFamilyName:string):Text;
		
		
		/**
		 * Sets the font family. The name can be any font from the Font
		 *  menu in Docs or
		 *  Google Fonts, and is
		 *  case-sensitive. Unrecognized font names will render as Arial. The
		 *  methods getFontFamily() and
		 *  setFontFamily(fontFamilyName) now use string names for fonts
		 *  instead of the
		 *  FontFamily
		 *  enum. Although this enum is deprecated, it will remain available for
		 *  compatibility with older scripts.
		 * @param fontFamilyName the name of the font family, from the Font menu in Docs or Google Fonts
		 * @return Text — the current element
		 */
		public setFontFamily(fontFamilyName:string):Text;
		
		
		/**
		 * Sets the font size.
		 * @param size the font size
		 * @return Text — the current element
		 */
		public setFontSize(size:Integer):Text;
		
		
		/**
		 * Sets the font size for the specified character range.
		 * @param startOffset the text range's start offset
		 * @param endOffsetInclusive the text range's end offset
		 * @param size the font size
		 * @return Text — the current element
		 */
		public setFontSize(startOffset:Integer, endOffsetInclusive:Integer, size:Integer):Text;
		
		
		/**
		 * Sets the foreground color for the specified character range.
		 * @param startOffset the text range's start offset
		 * @param endOffsetInclusive the text range's end offset
		 * @param color the foreground color, formatted in CSS notation (like '#ffffff')
		 * @return Text — the current element
		 */
		public setForegroundColor(startOffset:Integer, endOffsetInclusive:Integer, color:string):Text;
		
		
		/**
		 * Sets the foreground color.
		 * @param color the foreground color, formatted in CSS notation (like '#ffffff')
		 * @return Text — the current element
		 */
		public setForegroundColor(color:string):Text;
		
		
		/**
		 * Sets the italic setting.
		 * @param italic the italic setting
		 * @return Text — the current element
		 */
		public setItalic(italic:boolean):Text;
		
		
		/**
		 * Sets the italic setting for the specified character range.
		 * @param startOffset the text range's start offset
		 * @param endOffsetInclusive the text range's end offset
		 * @param italic the italic setting
		 * @return Text — the current element
		 */
		public setItalic(startOffset:Integer, endOffsetInclusive:Integer, italic:boolean):Text;
		
		/**
		 * Sets the link url for the specified character range.
		 * @param startOffset the text range's start offset
		 * @param endOffsetInclusive the text range's end offset
		 * @param url the link url
		 * @return Text — the current element
		 */
		public setLinkUrl(startOffset:Integer, endOffsetInclusive:Integer, url:string):Text;
		
		/**
		 * Sets the link url.
		 * @param url the link url
		 * @return Text — the current element
		 */
		public setLinkUrl(url:string):Text;
		
		/**
		 * Sets the strikethrough setting.
		 * @param strikethrough the strikethrough setting
		 * @return Text — the current element
		 */
		public setStrikethrough(strikethrough:boolean):Text;
		
		/**
		 * Sets the strikethrough setting for the specified character range.
		 * @param startOffset the text range's start offset
		 * @param endOffsetInclusive the text range's end offset
		 * @param strikethrough the strikethrough setting
		 * @return Text — the current element
		 */
		public setStrikethrough(startOffset:Integer, endOffsetInclusive:Integer, strikethrough:boolean):Text;
		
		/**
		 * Sets the text contents.
		 * @param text the new text contents
		 * @return Text — the current element
		 */
		public setText(text:string):Text;
		
		/**
		 * Sets the text alignment for a given character range. The available types of alignment are
		 *  DocumentApp.TextAlignment.NORMAL, DocumentApp.TextAlignment.SUBSCRIPT, and
		 *  DocumentApp.TextAlignment.SUPERSCRIPT.
		 * @param startOffset the start offset of the character range
		 * @param endOffsetInclusive the end offset of the character range (inclusive)
		 * @param textAlignment the type of text alignment to apply
		 * @return Text — the current element
		 */
		public setTextAlignment(startOffset:Integer, endOffsetInclusive:Integer, textAlignment:TextAlignment):Text;
		
		/**
		 * Sets the text alignment. The available types of alignment are
		 *  DocumentApp.TextAlignment.NORMAL, DocumentApp.TextAlignment.SUBSCRIPT, and
		 *  DocumentApp.TextAlignment.SUPERSCRIPT.
		 * @param textAlignment the type of text alignment to apply
		 * @return Text — the current element
		 */
		public setTextAlignment(textAlignment:TextAlignment):Text;
		
		/**
		 * Sets the underline setting.
		 * @param underline the underline setting
		 * @return Text — the current element
		 */
		public setUnderline(underline:boolean):Text;
		
		/**
		 * Sets the underline setting for the specified character range.
		 * @param startOffset the text range's start offset
		 * @param endOffsetInclusive the text range's end offset
		 * @param underline the underline setting
		 * @return Text — the current element
		 */
		public setUnderline(startOffset:Integer, endOffsetInclusive:Integer, underline:boolean):Text;
	}
	
	class TextAlignment{}
	
	/**
	 * Creates and returns a new document.
	 * @param name the new document's name
	 *
	 * @return Document — the new document instance
	 */
	function create(name: string): Document;
	
	/**
	 * Returns the document to which the script is
	 *  container-bound. To interact with document to
	 *  which the script is not container-bound, use openById(id) or
	 *  openByUrl(url) instead.
	 *
	 * @return Document — the document instance
	 */
	function getActiveDocument(): Document;
	
	/**
	 * Returns an instance of the document's user-interface environment that allows the script to add
	 *  features like menus, dialogs, and sidebars. A script can only interact with the UI for the
	 *  current instance of an open document, and only if the script is
	 *  bound to the document. For more information, see
	 *  the guides to menus and
	 *  dialogs and sidebars.
	 *
	 * @return Ui — an instance of this document's user-interface environment
	 */
	function getUi(): Ui;
	
	/**
	 * Returns the document with the specified ID. If the script is container-bound to the document,
	 *  use getActiveDocument() instead.
	 * @param id the ID of the document to open
	 *
	 * @return Document — the document instance
	 */
	function openById(id: string): Document;
	
	/**
	 * Opens and returns the document with the specified URL. If the script is container-bound to the
	 *  document, use getActiveDocument() instead.
	 * @param url the URL of the document to open
	 *
	 * @return Document — the document instance
	 */
	function openByUrl(url: string): Document;
	
}

declare namespace HtmlService {
	
	/**
	 * Creates a new HtmlOutput object that can be returned from the script.
	 *
	 * @return HtmlOutput — the new HtmlOutput object
	 */
	function createHtmlOutput():HtmlOutput;
	
	/**
	 * Creates a new HtmlOutput object from a BlobSource resource.
	 * @param blob the object to get HTML out of
	 * @return HtmlOutput — the new HtmlOutput object
	 */
	function createHtmlOutput(blob:BlobSource):HtmlOutput;
	
	/**
	 * Creates a new HtmlOutput object that can be returned from the script.
	 * @param html the content to serve
	 * @return HtmlOutput — the new HtmlOutput object
	 */
	function createHtmlOutput(html:string):HtmlOutput;
	
	/**
	 * Creates a new HtmlOutput object from a file in the code editor.
	 * @param filename the name of the file to use
	 * @return HtmlOutput — the new HtmlOutput object
	 */
	function createHtmlOutputFromFile(filename:string):HtmlOutput;
	
	/**
	 * Creates a new HtmlTemplate object from a BlobSource resource.
	 * @param blob the object to get HTML out of
	 * @return HtmlTemplate — the new HtmlTemplate object
	 */
	function createTemplate(blob:BlobSource):HtmlTemplate;
	
	/**
	 * Creates a new HtmlTemplate object that can be returned from the script.
	 * @param html the content of the template
	 * @return HtmlTemplate — the new HtmlTemplate object
	 */
	function createTemplate(html:string):HtmlTemplate;
	
	/**
	 * Creates a new HtmlTemplate object from a file in the code editor.
	 * @param filename the name of the file to use
	 * @return HtmlTemplate — the new HtmlTemplate object
	 */
	function createTemplateFromFile(filename:string):HtmlTemplate;
	
	/**
	 * Gets the user-agent string for the current browser.
	 *
	 * @return string — the user-agent string
	 */
	function getUserAgent():string;
	
	class HtmlOutput {
		
		/**
		 * Adds a meta tag to the page. Meta tags included directly in an Apps Script HTML file are
		 *  ignored. Only the following meta tags are allowed:
		 * @param name the value of the meta tag's name attribute
		 * @param content the value of the meta tag's content attribute
		 * @return HtmlOutput — this HtmlOutput itself, useful for chaining
		 */
		public addMetaTag(name:string, content:string):HtmlOutput;
		
		
		/**
		 * Appends new content to the content of this HtmlOutput. Use this only for content from a
		 *  trusted source, because it is not escaped.
		 * @param addedContent the content to append
		 */
		public append(addedContent:string):void;
		
		
		/**
		 * Appends new content to the content of this HtmlOutput, using contextual escaping.
		 * @param addedContent the content to append
		 */
		public appendUntrusted(addedContent:string):void;
		
		
		/**
		 * Returns an HtmlTemplate backed by this HtmlOutput. This method can be used to
		 *  build up a template incrementally. Future changes to HtmlOutput will affect the
		 *  contents of the HtmlTemplate as well.
		 *
		 * @return HtmlTemplate — the new HtmlTemplate
		 */
		public asTemplate():HtmlTemplate;
		
		
		/**
		 * Clears the current content.
		 *
		 * @return HtmlOutput — the HtmlOutput itself, useful for chaining
		 */
		public clear():HtmlOutput;
		
		
		/**
		 * Return the data inside this object as a blob converted to the specified content type. This
		 *  method adds the appropriate extension to the filename — for example, "myfile.pdf". However, it
		 *  assumes that the part of the filename that follows the last period (if any) is an existing
		 *  extension that should be replaced. Consequently, "ChristmasList.12.25.2014" will become
		 *  "ChristmasList.12.25.pdf".
		 * @param contentType the MIME type to convert to. For most blobs,
		 *      'application/pdf' is the only valid option. For images in BMP, GIF, JPEG,
		 *      or PNG format, any of 'image/bmp', 'image/gif',
		 *      'image/jpeg', or 'image/png' are also valid.
		 * @return Blob — the data as a blob
		 */
		public getAs(contentType:string):Blob;
		
		
		/**
		 * Return the data inside this object as a blob.
		 *
		 * @return Blob — the data as a blob
		 */
		public getBlob():Blob;
		
		
		/**
		 * Gets the content of this HtmlOutput.
		 *
		 * @return string — the content that will be served
		 */
		public getContent():string;
		
		
		/**
		 * Gets the URL for a favicon link tag added to the page by calling
		 *  setFaviconUrl(iconUrl). Favicon link tags included directly in an Apps Script HTML file
		 *  are ignored.
		 *
		 * @return string — the URL of the favicon image
		 */
		public getFaviconUrl():string;
		
		
		/**
		 * Gets the initial height of the
		 *  custom dialog in Google
		 *  Docs, Sheets, or Forms. If the HtmlOutput is published as a web app instead, this
		 *  method returns null. To resize a dialog that is already open, call
		 *  google.script.host.setHeight(height)
		 *  in client-side code.
		 *
		 * @return Integer — the height, in pixels
		 */
		public getHeight():Integer;
		
		
		/**
		 * Gets an array of objects that represent meta tags added to the page by calling
		 *  addMetaTag(name, content). Meta tags included directly in an Apps Script HTML file
		 *  are ignored.
		 *
		 * @return HtmlOutputMetaTag[] — an array of objects that represent meta tags added to the page by calling
		 *      addMetaTag(name, content)
		 */
		public getMetaTags():HtmlOutputMetaTag[];
		
		
		/**
		 * Gets the title of the output page. Note that the <title> HTML element is ignored.
		 *
		 * @return string — the title of the page
		 */
		public getTitle():string;
		
		
		/**
		 * Gets the initial width of the
		 *  custom dialog
		 *  in Google Docs, Sheets, or Forms. If the HtmlOutput is published as a web app instead,
		 *  this method returns null. To resize a dialog that is already open, call
		 *  google.script.host.setWidth(width)
		 *  in client-side code.
		 *
		 * @return Integer — the width in pixels
		 */
		public getWidth():Integer;
		
		
		/**
		 * Sets the content of this HtmlOutput.
		 * @param content the content to serve
		 * @return HtmlOutput — this HtmlOutput itself, useful for chaining
		 */
		public setContent(content:string):HtmlOutput;
		
		
		/**
		 * Adds a link tag for a favicon to the page. Favicon link tags included directly in an Apps
		 *  Script HTML file are ignored.
		 * @param iconUrl the URL of the favicon image, with the image extension indicating the image type
		 * @return HtmlOutput — this HtmlOutput itself, useful for chaining
		 */
		public setFaviconUrl(iconUrl:string):HtmlOutput;
		
		
		/**
		 * Sets the initial height of the
		 *  custom dialog in Google
		 *  Docs, Sheets, or Forms. If the HtmlOutput is published as a web app instead, this
		 *  method has no effect. To resize a dialog that is already open, call
		 *  google.script.host.setHeight(height)
		 *  in client-side code.
		 * @param height the new height in pixels; null results in a default value
		 * @return HtmlOutput — this HtmlOutput itself, useful for chaining
		 */
		public setHeight(height:Integer):HtmlOutput;
		
		
		/**
		 * This method now has no effect — previously it set the
		 *  sandbox mode used for client-side scripts. To protect users from being
		 *  served malicious HTML or JavaScript, client-side code served from HTML service executes in a
		 *  security sandbox that imposes restrictions on the code. Originally this method allowed script
		 *  authors to choose between different versions of the sandbox, but now all scripts now use
		 *  IFRAME mode regardless of what sandbox mode is set. For more information, see the
		 *  guide to restrictions in HTML service.
		 * @param mode the sandbox mode to use
		 * @return HtmlOutput — this HtmlOutput itself, useful for chaining
		 */
		public setSandboxMode(mode:SandboxMode):HtmlOutput;
		
		
		/**
		 * Sets the title of the output page. For web apps, this will be the title of the entire page,
		 *  while for HtmlOutput shown in Google Sheets, this will be the dialog title.
		 * @param title the new title
		 * @return HtmlOutput — this HtmlOutput itself, useful for chaining
		 */
		public setTitle(title:string):HtmlOutput;
		
		
		/**
		 * Sets the initial width of a
		 *  custom dialog
		 *  in Google Docs, Sheets, or Forms. If the HtmlOutput is published as a web app instead,
		 *  this method has no effect. To resize a dialog that is already open, call
		 *  google.script.host.setWidth(width)
		 *  in client-side code.
		 * @param width the new width in pixels; null results in a default value
		 * @return HtmlOutput — this HtmlOutput itself, useful for chaining
		 */
		public setWidth(width:Integer):HtmlOutput;
		
		
		/**
		 * Sets the state of the page's X-Frame-Options header, which controls clickjacking
		 *  prevention.
		 * @param mode
		 * @return HtmlOutput — this HtmlOutput itself, useful for chaining
		 */
		public setXFrameOptionsMode(mode:XFrameOptionsMode):HtmlOutput;
		
	}
	
	class HtmlOutputMetaTag{}
	
	class HtmlTemplate {
		
		/**
		 * Evaluates this template and returns an HtmlOutput object. Any properties set on this
		 *  HtmlTemplate object will be in scope when evaluating. To debug errors in a template,
		 *  examine the code using the getCode() method.
		 *
		 * @return HtmlOutput — an HtmlOutput object
		 */
		public evaluate():HtmlOutput;
		
		
		/**
		 * Generates a string of JavaScript code, based on the template file, that can be evaluated. This
		 *  method produces a string of JavaScript code based on the template file. Calling
		 *  eval(<code>) will return a new HtmlOutput object with the content of
		 *  the template after running all embedded server scripts. The generated code is intended to be
		 *  human-readable, and so if you need to debug a template you can call
		 *  Logger.log(<code>) to see what was produced.
		 *
		 * @return string — a string based on the template, which can be evaluated
		 */
		public getCode():string;
		
		
		/**
		 * Generates a string of JavaScript code that can be evaluated, with each line of the code
		 *  containing the original line from the template as a comment. This method produces a string of
		 *  JavaScript code based on the template file. Calling eval(<code>) will return
		 *  a new HtmlOutput object with the content of the template after running all embedded
		 *  server scripts. The generated code is intended to be human-readable, and so if you need to
		 *  debug a template you can call Logger.log(<code>) to see what was produced.
		 *
		 * @return string — an string based on the template, which can be evaluated
		 */
		public getCodeWithComments():string;
		
		
		/**
		 * Returns the unprocessed content of this template.
		 *
		 * @return string — the template's raw content
		 */
		public getRawContent():string;
		
	}
	
	class XFrameOptionsMode {}
	
}

declare namespace PropertiesService {
	
	class Properties {
		
		/**
		 * Deletes all properties in the current Properties store.
		 *
		 * @return Properties — this Properties store, for chaining
		 */
		public deleteAllProperties():Properties;
		
		
		/**
		 * Deletes the property with the given key in the current Properties store.
		 * @param key the key for the property to delete
		 * @return Properties — this Properties store, for chaining
		 */
		public deleteProperty(key:string):Properties;
		
		
		/**
		 * Gets all keys in the current Properties store.
		 *
		 * @return string[] — an array of all keys in the current Properties store
		 */
		public getKeys():string[];
		
		
		/**
		 * Gets a copy of all key-value pairs in the current Properties store. Note that the
		 *  returned object is not a live view of the store. Consequently, changing the properties on the
		 *  returned object will not automatically update them in storage, or vice versa.
		 *
		 * @return any — a copy of all key-value pairs in the current Properties store
		 */
		public getProperties():any;
		
		
		/**
		 * Gets the value associated with the given key in the current Properties store, or
		 *  null if no such key exists.
		 * @param key the key for the property value to retrieve
		 * @return string — the value associated with the given key in the current Properties store
		 */
		public getProperty(key:string):string;
		
		
		/**
		 * Sets all key-value pairs from the given object in the current Properties store.
		 * @param properties an object containing key-values pairs to set
		 * @return Properties — this Properties store, for chaining
		 */
		public setProperties(properties:any):Properties;
		
		
		/**
		 * Sets all key-value pairs from the given object in the current Properties store,
		 *  optionally deleting all other properties in the store.
		 * @param properties an object containing key-values pairs to set
		 * @param deleteAllOthers true to delete all other key-value pairs in the properties
		 *      object; false to not
		 * @return Properties — this Properties store, for chaining
		 */
		public setProperties(properties:any, deleteAllOthers:boolean):Properties;
		
		
		/**
		 * Sets the given key-value pair in the current Properties store.
		 * @param key the key for the property
		 * @param value the value to associate with the key
		 * @return Properties — this Properties store, for chaining
		 */
		public setProperty(key:string, value:string):Properties;
		
	}
	
	/**
	 * Gets a property store that all users can access within the open document, spreadsheet, or form.
	 *  It is only available if the script is published and executing as an add-on or if it is
	 *  bound to a Google
	 *  file type. When document properties are not available this method returns null.
	 *
	 * @return Properties — a property store that all users of the current document can access, or null if
	 *      the script is not bound to a G Suite file
	 */
	function getDocumentProperties():Properties;
	
	/**
	 * Gets a property store that all users can access, but only within this script.
	 *
	 * @return Properties — a property store that all users of the script can access
	 */
	function getScriptProperties():Properties;
	
	/**
	 * Gets a property store that only the current user can access, and only within this script.
	 *
	 * @return Properties — a property store that only the current user of the script can access
	 */
	function getUserProperties():Properties;
	
}

declare namespace ScriptApp {
	class AuthMode {
		static LIMITED:AuthMode;
		static NONE:AuthMode;
		static FULL:AuthMode;
	}
}

