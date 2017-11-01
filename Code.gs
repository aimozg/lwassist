/*
 * Created by aimozg on 18.06.2017.
 * Confidential until published on GitHub
 */
function traceElement(depth, e) {
    function attrstr(attrs) {
        var text = JSON.stringify(attrs);
        text = text.replace(/"\w+":(null|\{\})/g, '');
        text = text.replace(/"LEFT_TO_RIGHT":true/g, '');
        text = text.replace(/,+}/g, '}');
        text = text.replace(/\{,+/g, '{');
        text = text.replace(/,+"/g, ', "');
        return text;
    }
    var TEXT = 80;
    var NODES = 100;
    var indent = '';
    for (var i = 0; i < depth; i++)
        indent += '\t';
    var type = e.getType();
    var s = indent;
    s += ' type=' + type;
    var text = attrstr(e.getAttributes());
    if (text !== '{}')
        s += ' attrs=' + text;
    if (type === DocumentApp.ElementType.PARAGRAPH) {
        var p = e;
        var heading = p.getHeading();
        s += ' level=' + heading;
        s += ' indent=' + Math.max(p.getIndentStart(), p.getIndentFirstLine());
    }
    Logger.log(s);
    if (type === DocumentApp.ElementType.TEXT) {
        var t = e;
        var runs = t.getTextAttributeIndices();
        text = t.getText();
        for (var i = 0; i < runs.length; i++) {
            var i1 = runs[i];
            var i2 = (i + 1 === runs.length) ? t.getText().length : runs[i + 1];
            s = indent + '\t' + i1 + '..' + i2 + ': ';
            var subtext = attrstr(t.getAttributes(i1));
            if (subtext !== '{}')
                s += ' attrs=' + subtext;
            subtext = text.substring(i1, i2);
            s += ' text=' + JSON.stringify(subtext.slice(0, TEXT));
            if (subtext.length > TEXT)
                s += '...[' + subtext.length + ']';
            Logger.log(s);
        }
    }
    if ('getNumChildren' in e) {
        var c = e;
        var n = c.getNumChildren();
        if (n > 0) {
            var i = void 0;
            for (i = 0; i < n && i < NODES / 2; i++) {
                traceElement(depth + 1, c.getChild(i));
            }
            if (n > NODES) {
                Logger.log(indent + '\t... (' + (n - NODES) + ' more)');
            }
            if (i + NODES / 2 < n)
                i = n - NODES / 2;
            for (; i < n; i++) {
                traceElement(depth + 1, c.getChild(i));
            }
        }
    }
}
function applyStyle(run, style) {
    var sty = {};
    if ('fg' in style && style.fg !== null)
        sty[DocumentApp.Attribute.FOREGROUND_COLOR] = style.fg;
    if ('bg' in style && style.bg !== null)
        sty[DocumentApp.Attribute.BACKGROUND_COLOR] = style.bg;
    if ('bold' in style && style.bold !== null)
        sty[DocumentApp.Attribute.BOLD] = '' + style.bold;
    if ('italic' in style && style.italic !== null)
        sty[DocumentApp.Attribute.ITALIC] = '' + style.italic;
    if ('face' in style && style.face !== null)
        sty[DocumentApp.Attribute.FONT_FAMILY] = style.face;
    run.element.setAttributes(run.i1, run.i2 - 1, sty);
}
function debugDom() {
    Logger.clear();
    traceElement(0, DocumentApp.getActiveDocument().getBody());
    return {
        logs: Logger.getLog()
    };
}
function cap1(s) {
    return s.substr(0, 1).toUpperCase() + s.substr(1);
}
function cap0(s) {
    return s.substr(0, 1).toLowerCase() + s.substr(1);
}
function capX(s, firstCap, joiner, splitter) {
    if (joiner === void 0) { joiner = ''; }
    if (splitter === void 0) { splitter = /\s+/; }
    return s.split(splitter).map(function (s, i) { return (i >= firstCap ? cap1(s) : cap0(s)); }).join(joiner);
}
function uncomment(s) {
    var i = s.indexOf('//');
    if (i >= 0)
        return [s.substr(0, i), s.substr(i + 2).trim()];
    return [s, ''];
}
function strip(s, filter) {
    if (filter === void 0) { filter = /\s+/g; }
    return s.replace(filter, '');
}
var REX_ID = /[^a-zA-Z0-9_$]/g;
var REX_SIMPLE_EXPR = /[^a-zA-Z0-9_$.()]/g;
var REX_EXPR = /[^a-zA-Z0-9_$.,()!><=+']/g;
function identifier(s, filter) {
    if (filter === void 0) { filter = REX_ID; }
    var ss = s.trim().split(/\s+/);
    var i = 0;
    var n = ss.length;
    for (; i < n; i++) {
        ss[i] = strip(ss[i], filter);
        if (i > 0)
            ss[i] = cap1(ss[i]);
    }
    //Logger.log('identifier('+JSON.stringify(s)+')='+JSON.stringify(ss.join('')));
    return ss.join('');
}
function findUnescaped(haystack, needle, start) {
    var r = haystack.indexOf(needle, start);
    while (r > 0 && haystack[r - 1] === '\\')
        r = haystack.indexOf(needle, r + 1);
    return r;
}
function findIndent(e) {
    return Math.max(e.par.getIndentFirstLine(), e.par.getIndentFirstLine());
}
function matchStringLiteral(s) {
    return s.match(/^“([^”]*)”\s*/) ||
        s.match(/^‘([^’]*)’\s*/) ||
        s.match(/^"([^"]*)"\s*/) ||
        s.match(/^'([^']*)'\s*/);
}
function extractTagWithRest(s) {
    var match;
    if ((match = s.match(/^\[\s*([\w\-_$]+)\s*(.*)\]\s*$/))) {
        return [match[1].toLowerCase(), match[2]];
    }
    return ['', ''];
}
function paragraphOf(ele) {
    while (ele && ele.getType() !== DocumentApp.ElementType.PARAGRAPH)
        ele = ele.getParent();
    return ele ? ele.asParagraph() : null;
}
function headingValue(h) {
    switch (h) {
        case DocumentApp.ParagraphHeading.TITLE: return 0;
        case DocumentApp.ParagraphHeading.SUBTITLE: return 1;
        case DocumentApp.ParagraphHeading.HEADING1: return 2;
        case DocumentApp.ParagraphHeading.HEADING2: return 3;
        case DocumentApp.ParagraphHeading.HEADING3: return 4;
        case DocumentApp.ParagraphHeading.HEADING4: return 5;
        case DocumentApp.ParagraphHeading.HEADING5: return 6;
        case DocumentApp.ParagraphHeading.HEADING6: return 7;
        case DocumentApp.ParagraphHeading.NORMAL: return 8;
        default: return 10;
    }
}
function iterateFromHeader(header, code) {
    var h0 = headingValue(header.getHeading());
    var next = header;
    while (true) {
        do {
            next = next.getNextSibling();
        } while (next && next.getType() != DocumentApp.ElementType.PARAGRAPH);
        if (!next)
            break;
        var par = next.asParagraph();
        if (headingValue(par.getHeading()) <= h0) {
            break;
        }
        code(par);
    }
}
var GroupStyleZero = ['#000000', '#000000', '#ffffff', '#ffffff'];
var GroupStyles = [
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
];
function groupStyle(depth2) {
    return depth2 <= 0 ? GroupStyleZero : GroupStyles[(depth2 + GroupStyles.length - 1) % GroupStyles.length];
}
function formatSection(header, options) {
    var depth = 0;
    iterateFromHeader(header, function (par) {
        if (par.getHeading() === DocumentApp.ParagraphHeading.NORMAL) {
            var runs = splitParagraph(par);
            for (var _i = 0, runs_1 = runs; _i < runs_1.length; _i++) {
                var run = runs_1[_i];
                switch (run.type) {
                    case 'text':
                        applyStyle(run, { fg: groupStyle(depth)[1] });
                        break;
                    case 'tag':
                        applyStyle(run, { fg: '#7722aa' });
                        break;
                    case "comment":
                        applyStyle(run, { fg: '#666666', face: 'Consolas' });
                        break;
                    case "xml":
                        var xi = run.xml;
                        applyStyle(run, { fg: '#227722', face: 'Consolas' });
                        if (!xi.single) {
                            if (['case', 'default', 'if', 'else'].indexOf(xi.tag) != -1) {
                                if (xi.open)
                                    depth++;
                                if (xi.closing)
                                    depth--;
                            }
                        }
                }
            }
        }
        else {
            depth = 0;
        }
    });
}
function formatDocument(options) {
    if (options === void 0) { options = {}; }
    //const userProperties = PropertiesService.getUserProperties();
    //userProperties.setProperty('flushFormat', ''+ options.applyFormat);
    Logger.clear();
    Logger.log("formatDocument(" + JSON.stringify(options) + ")");
    var doc = DocumentApp.getActiveDocument();
    var pos = doc.getCursor();
    var par = paragraphOf(pos.getElement());
    while (par && par.getHeading() === DocumentApp.ParagraphHeading.NORMAL) {
        par = paragraphOf(par.getPreviousSibling());
    }
    if (!par)
        return;
    formatSection(par, options);
}
/**
 * @OnlyCurrentDoc
 */
///<reference path="utils.ts"/>
///<reference path="formatter.ts"/>
function onOpen(e) {
    DocumentApp.getUi().createAddonMenu()
        .addItem('Show', 'showSidebar')
        .addToUi();
}
function onInstall(e) {
    onOpen(e);
}
function showSidebar() {
    var ui = HtmlService.createHtmlOutputFromFile('Sidebar')
        .setTitle("Lewd Writer's Assistant");
    DocumentApp.getUi().showSidebar(ui);
}
function ifund(x, y) {
    return x === undefined ? y : x;
}
function getPreferences() {
    var userProperties = PropertiesService.getUserProperties();
    return {};
}
/*
 * Created by aimozg on 18.06.2017.
 * Confidential until published on GitHub
 */
var LA_TEXT = /^[^<\[\\]+/;
var LA_ENT = /^&#?[a-zA-Z0-9]+;/;
var LA_TAG_OPEN = /^\[/;
var LA_TAG_CONTENT = /^[^<\]\\]+/;
var LA_XML_CLOSE = /^<\/([a-zA-Z0-9_\-:]+)>/;
var LA_XML_TAG_START = /^<([a-zA-Z0-9_\-:]+)/;
var LA_XML_TAG_INNER = /^[^>]+/;
var LA_XML_TAG_END = /^\/?>/;
var LA_XML_COMMENT = /^<!--[\s\S\n]*?-->/;
function splitParagraph(par) {
    var rslt = [];
    for (var ci = 0, cn = par.getNumChildren(); ci < cn; ci++) {
        var c = par.getChild(ci).asText();
        if (!c)
            continue;
        var runs = c.getTextAttributeIndices();
        var text = c.getText();
        runs.shift();
        runs.push(text.length);
        //Logger.log('runs = '+JSON.stringify(runs));
        // 1) Split text
        var textParts = [];
        while (text) {
            var m = void 0;
            var text0 = text;
            if (text[0] == '\\') {
                if (text.length >= 2 && text[1] != '<') {
                    textParts.push(text.slice(0, 2));
                    text = text.slice(2);
                }
                else {
                    textParts.push(text);
                    text = '';
                }
            }
            else if ((m = text.match(LA_TEXT))) {
                textParts.push(m[0]);
                text = text.slice(m[0].length);
            }
            else if ((m = text.match(LA_XML_COMMENT))) {
                textParts.push(m[0]);
                text = text.slice(m[0].length);
            }
            else if ((m = text.match(LA_ENT))) {
                textParts.push(m[0]);
                text = text.slice(m[0].length);
            }
            else if ((m = text.match(LA_TAG_OPEN))) {
                var s = m[0];
                text = text.slice(s.length);
                while (text) {
                    if (text[0] == ']') {
                        s += ']';
                        text = text.slice(1);
                        break;
                    }
                    else if (text[0] == '\\') {
                        if (text.length >= 2 && text[1] != '<') {
                            s += text.slice(0, 2);
                            text = text.slice(2);
                        }
                        else {
                            s += text[0];
                            text = text.slice(1);
                        }
                    }
                    else if ((m = text.match(LA_TAG_CONTENT))) {
                        s += m[0];
                        text = text.slice(m[0].length);
                    }
                    else {
                        Logger.log('Illegal parser tag ' + JSON.stringify(s + text) + ' after ' + JSON.stringify(textParts));
                        return [];
                    }
                }
                textParts.push(s);
            }
            else if ((m = text.match(LA_XML_CLOSE))) {
                textParts.push(m[0]);
                text = text.slice(m[0].length);
            }
            else if ((m = text.match(LA_XML_TAG_START))) {
                var s = m[0];
                text = text.slice(s.length);
                while (text) {
                    if ((m = text.match(LA_XML_TAG_INNER))) {
                        s += m[0];
                        text = text.slice(m[0].length);
                    }
                    else if ((m = text.match(LA_XML_TAG_END))) {
                        s += m[0];
                        text = text.slice(m[0].length);
                        break;
                    }
                    else {
                        Logger.log('Illegal XML tag ' + JSON.stringify(s + text) + ' after ' + JSON.stringify(textParts));
                        return [];
                    }
                }
                textParts.push(s);
            }
            else {
                textParts.push(text[0]);
                text = text.slice(1);
            }
            if (text == text0) {
                Logger.log('ERROR stuck on ' + JSON.stringify(text) + ' after ' + JSON.stringify(textParts));
                return [];
            }
        }
        // 2) Subsplit is raw text and different formatting
        var i1 = 0;
        while (textParts.length > 0) {
            var tp = textParts[0];
            var i2 = i1 + tp.length;
            if (tp[0] != '[' && tp[0] != '<' && tp[0] != '\\') {
                i2 = Math.min(runs[0], i2);
            }
            if (i1 >= i2) {
                Logger.log("ERROR: cannot create run " + i1 + ":" + i2 + "; progress is " + rslt.map(TTextRun.toString));
                return [];
            }
            var type = void 0;
            if (tp.match(LA_XML_COMMENT)) {
                type = 'comment';
            }
            else if (tp[0] == '<') {
                type = 'xml';
            }
            else if (tp[0] == '[') {
                type = 'tag';
            }
            else {
                type = 'text';
            }
            var run = {
                par: par,
                element: c,
                i1: i1,
                i2: i2,
                text: tp.slice(0, i2 - i1),
                bold: c.isBold(i2 - 1),
                italic: c.isItalic(i2 - 1),
                type: type
            };
            if (type == 'xml')
                run.xml = parseXmlTag(run.text);
            rslt.push(run);
            tp = tp.slice(i2 - i1);
            i1 = i2;
            if (tp) {
                textParts[0] = tp;
            }
            else {
                textParts.shift();
            }
            while (runs.length > 0 && runs[0] <= i2)
                runs.shift();
        }
    }
    return rslt;
}
function parseXmlTag(xml) {
    var m;
    var x = { tag: '', single: true, closing: false, open: false };
    if ((m = xml.match(LA_XML_TAG_START))) {
        x.tag = m[1];
        x.open = true;
        x.single = !!xml.match(/\/>$/);
    }
    else if ((m = xml.match(LA_XML_CLOSE))) {
        x.tag = m[1];
        x.closing = true;
        x.single = false;
    }
    return x;
}
/*
 * Created by aimozg on 18.06.2017.
 * Confidential until published on GitHub
 */
var Document = DocumentApp.Document;
var Paragraph = DocumentApp.Paragraph;
var Text = DocumentApp.Text;
var Element = DocumentApp.Element;
var ContainerElement = DocumentApp.ContainerElement;
var TTextRun;
(function (TTextRun) {
    function toString(run) {
        return "(" + run.type + ' ' + run.i1 + ":" + run.i2 + " " + (run.bold ? "B" : "") + (run.italic ? "I" : "") +
            " " + JSON.stringify(run.text.substring(0, 100)) + ")";
    }
    TTextRun.toString = toString;
})(TTextRun || (TTextRun = {}));
/*
 * Created by aimozg on 01.11.2017.
 * Confidential until published on GitHub
 */
function exportSection(header, options) {
    var ItalicOn = {
        '': 'i', 'b': 'bi', 'i': 'i', 'bi': 'bi', 'ib': 'ib'
    };
    var BoldOn = {
        '': 'b', 'b': 'b', 'i': 'ib', 'bi': 'bi', 'ib': 'ib'
    };
    var ItalicOff = {
        '': '', 'b': 'b', 'i': '', 'bi': 'b', 'ib': 'b'
    };
    var BoldOff = {
        '': '', 'b': '', 'i': 'i', 'bi': 'i', 'ib': 'i'
    };
    var IsItalic = {
        '': false, 'b': false, 'i': true, 'bi': true, 'ib': true
    };
    var IsBold = {
        '': false, 'b': true, 'i': false, 'bi': true, 'ib': true
    };
    function applyStyle(prev, next) {
        return {
            '': {
                '': '',
                'b': '<b>',
                'i': '<i>',
                'bi': '<b><i>',
                'ib': '<i><b>'
            },
            'b': {
                '': '</b>',
                'b': '',
                'i': '</b><i>',
                'bi': '<i>',
                'ib': '</b><i><b>'
            },
            'i': {
                '': '</i>',
                'b': '</i><b>',
                'i': '',
                'bi': '</i><b><i>',
                'ib': '<b>'
            },
            'bi': {
                '': '</i></b>',
                'b': '</i>',
                'i': '</i></b><i>',
                'bi': '',
                'ib': '</i></b><i><b>'
            },
            'ib': {
                '': '</b></i>',
                'b': '</b></i><b>',
                'i': '</b>',
                'bi': '</b></i><b><i>',
                'ib': ''
            },
        }[prev][next];
    }
    function myName(par) {
        return par.getText().split('/').reverse()[0];
    }
    function exportStory(s) {
        var tag = 'text';
        var body = s.content.map(function (obj) {
            if (typeof obj === 'string') {
                return obj;
            }
            else {
                tag = 'lib';
                return exportStory(obj);
            }
        }).join('\n') + applyStyle(s.lastStyle, '');
        return "<" + tag + " name=\"" + s.name + "\">" + '\n' + body + '\n' + ("</" + tag + ">");
    }
    var root = {
        heading: headingValue(header.getHeading()),
        name: myName(header),
        content: [],
        lastStyle: ''
    };
    var stack = [root];
    iterateFromHeader(header, function (par) {
        var top = stack[0];
        if (par.getHeading() === DocumentApp.ParagraphHeading.NORMAL) {
            var runs = splitParagraph(par);
            var s = '';
            for (var _i = 0, runs_2 = runs; _i < runs_2.length; _i++) {
                var run = runs_2[_i];
                var newStyle = top.lastStyle;
                if (run.italic && !IsItalic[top.lastStyle]) {
                    newStyle = ItalicOn[newStyle];
                }
                else if (!run.italic && IsItalic[top.lastStyle]) {
                    newStyle = ItalicOff[newStyle];
                }
                if (run.bold && !IsBold[top.lastStyle]) {
                    newStyle = BoldOn[newStyle];
                }
                else if (!run.bold && IsBold[top.lastStyle]) {
                    newStyle = BoldOff[newStyle];
                }
                s += applyStyle(top.lastStyle, newStyle) + run.text;
                if (top.lastStyle != newStyle)
                    Logger.log("'" + top.lastStyle + "' -> '" + newStyle + "' by " + applyStyle(top.lastStyle, newStyle));
                top.lastStyle = newStyle;
            }
            s += applyStyle(top.lastStyle, '');
            top.lastStyle = '';
            top.content.push(s);
        }
        else {
            var h = headingValue(par.getHeading());
            while (h <= stack[0].heading) {
                Logger.log("pop(" + stack[0].name + ")");
                stack.shift();
            }
            // h > stack.heading
            var next = {
                heading: h,
                name: myName(par),
                content: [],
                lastStyle: ''
            };
            Logger.log("push(" + next.name + ")");
            stack[0].content.push(next);
            stack.unshift(next);
        }
    });
    return exportStory(root);
}
function exportDocument(options) {
    if (options === void 0) { options = {}; }
    Logger.clear();
    Logger.log("exportDocument(" + JSON.stringify(options) + ")");
    var doc = DocumentApp.getActiveDocument();
    var pos = doc.getCursor();
    var par = paragraphOf(pos.getElement());
    while (par && par.getHeading() === DocumentApp.ParagraphHeading.NORMAL) {
        par = paragraphOf(par.getPreviousSibling());
    }
    if (!par)
        return;
    var xml = exportSection(par, options);
    return {
        xml: xml
    };
}
