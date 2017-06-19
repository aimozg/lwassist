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
function styBg(sty, bg) {
    sty[DocumentApp.Attribute.BACKGROUND_COLOR] = bg;
    return sty;
}
function styFg(sty, fg) {
    sty[DocumentApp.Attribute.FOREGROUND_COLOR] = fg;
    return sty;
}
function styBold(sty, bold) {
    sty[DocumentApp.Attribute.BOLD] = '' + bold;
    return sty;
}
function styItalic(sty, italic) {
    sty[DocumentApp.Attribute.ITALIC] = '' + italic;
    return sty;
}
function styFace(sty, fontFamily) {
    sty[DocumentApp.Attribute.FONT_FAMILY] = fontFamily;
    return sty;
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
var GroupStyleZero = [null, null, null, null];
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
function formatDocument(files, options) {
    function formatBlock(run, depth2, boldable) {
        if (!run)
            return;
        var sty = {};
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
        run.element.setAttributes(run.i1, run.i2 - 1, sty);
    }
    function formatComment(run) {
        if (!run)
            return;
        var sty = {};
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
        run.element.setAttributes(run.i1, run.i2 - 1, sty);
    }
    function formatBtn(run) {
        if (!run)
            return;
        var sty = {};
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
        run.element.setAttributes(run.i1, run.i2 - 1, sty);
    }
    function formatStmt(stmt, depth) {
        if (!stmt)
            return;
        var depth2 = depth * 2;
        switch (stmt.type) {
            case 'text':
                formatBlock(stmt.run, depth2, false);
                break;
            case 'comment':
                formatComment(stmt.run);
                break;
            case 'if':
                formatBlock(stmt.run, depth2 + 1, true);
                formatStmts(stmt.thenBlock, depth + 1);
                formatBlock(stmt.elseRun, depth2 + 1, true);
                formatStmt(stmt.elseIfBlock, depth);
                formatStmts(stmt.elseBlock, depth + 1);
                formatBlock(stmt.endRun, depth2 + 1, false);
                break;
            case 'call':
            case 'exec':
                formatBlock(stmt.run, depth2, false);
                break;
            case 'button':
                formatBlock(stmt.run, depth2, false);
                formatBtn(stmt.run);
                break;
            default:
                formatBlock(stmt.run, depth2, false);
        }
    }
    function formatStmts(stmts, depth) {
        if (!stmts)
            return;
        for (var _i = 0, stmts_1 = stmts; _i < stmts_1.length; _i++) {
            var stmt = stmts_1[_i];
            formatStmt(stmt, depth);
        }
    }
    for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
        var file = files_1[_i];
        for (var _a = 0, _b = file.methods; _a < _b.length; _a++) {
            var method = _b[_a];
            formatStmts(method.statements, 0);
        }
    }
}
/**
 * @OnlyCurrentDoc
 */
///<reference path="utils.ts"/>
///<reference path="formatter.ts"/>
var Element = DocumentApp.Element;
var Paragraph = DocumentApp.Paragraph;
var Text = DocumentApp.Text;
var ContainerElement = DocumentApp.ContainerElement;
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
    return {
        applyFormat: ifund(userProperties.getProperty('applyFormat'), 'false') == 'true',
        blocksMode: ifund(userProperties.getProperty('colorBlocks'), 'color'),
        blocksBold: ifund(userProperties.getProperty('blocksBold'), 'false') == 'true',
        buttonsMode: ifund(userProperties.getProperty('buttonsMode'), 'boldmono'),
        commentsMode: ifund(userProperties.getProperty('commentsMode'), 'color')
    };
}
function transpile(options) {
    if (options === void 0) { options = {}; }
    var userProperties = PropertiesService.getUserProperties();
    userProperties.setProperty('flushFormat', '' + options.applyFormat);
    userProperties.setProperty('blocksMode', '' + options.blocksMode);
    userProperties.setProperty('blocksBold', '' + options.blocksBold);
    userProperties.setProperty('buttonsMode', '' + options.buttonsMode);
    userProperties.setProperty('commentsMode', '' + options.commentsMode);
    Logger.clear();
    Logger.log("transplie(" + JSON.stringify(options) + ")");
    var result = { as3: [] };
    var files = parseDocument(DocumentApp.getActiveDocument());
    result.as3 = writeSources(files);
    if (options.applyFormat)
        formatDocument(files, options);
    return result;
}
/*
 * Created by aimozg on 18.06.2017.
 * Confidential until published on GitHub
 */
function parseDocument(doc) {
    Logger.log("parseDocument()");
    var N;
    var DATA = [];
    function parseFile(I) {
        var p0 = DATA[I++];
        var name = strip(p0.text, /[^a-zA-Z0-9_$\/\.]/g);
        if (!name.match(/.+\.as$/)) {
            Logger.log('Skipping H2 ' + JSON.stringify(p0.text));
            return [I, null];
        }
        Logger.log('parseFile(' + JSON.stringify(name) + ')');
        var path = name.split('/');
        path.unshift('Scenes');
        path.unshift('classes');
        var classname = identifier(path.pop().replace('.as', ''));
        var file = {
            name: name,
            path: path,
            classname: classname,
            superclass: 'BaseContent',
            comment: p0.comment,
            config: null,
            methods: [],
            document: doc
        };
        var end = false;
        while (I < N && !end) {
            var _a = DATA[I], par = _a.par, text = _a.text, comment = _a.comment;
            switch (par.getHeading()) {
                case DocumentApp.ParagraphHeading.TITLE:
                case DocumentApp.ParagraphHeading.SUBTITLE:
                case DocumentApp.ParagraphHeading.HEADING1:
                case DocumentApp.ParagraphHeading.HEADING2:
                    end = true;
                    break;
                case DocumentApp.ParagraphHeading.HEADING3:
                case DocumentApp.ParagraphHeading.HEADING4:
                case DocumentApp.ParagraphHeading.HEADING5:
                    if (strip(text) === '(config)') {
                        _b = parseConfig(I, file), I = _b[0], file.config = _b[1];
                    }
                    else {
                        var method = void 0;
                        _c = parseMethod(I, file), I = _c[0], method = _c[1];
                        if (method)
                            file.methods.push(method);
                    }
                    break;
                case DocumentApp.ParagraphHeading.NORMAL:
                    if (text)
                        file.comment += '\n' + text;
                    if (comment)
                        file.comment += ' // ' + comment;
                    I++;
                    break;
                default:
                    Logger.log('Illegal ParagraphHeading: ' + par.getHeading());
                    I++;
            }
        }
        file.comment = file.comment.trim();
        Logger.log("END of parseFile()");
        return [I, file];
        var _b, _c;
    }
    function parseConfig(I, file) {
        var p0 = DATA[I++];
        Logger.log('parseConfig()');
        var config = {
            file: file,
            comment: p0.comment
        };
        var end = false;
        while (I < N && !end) {
            var par = DATA[I].par;
            switch (par.getHeading()) {
                case DocumentApp.ParagraphHeading.TITLE:
                case DocumentApp.ParagraphHeading.SUBTITLE:
                case DocumentApp.ParagraphHeading.HEADING1:
                case DocumentApp.ParagraphHeading.HEADING2:
                case DocumentApp.ParagraphHeading.HEADING3:
                case DocumentApp.ParagraphHeading.HEADING4:
                case DocumentApp.ParagraphHeading.HEADING5:
                    end = true;
                    break;
                case DocumentApp.ParagraphHeading.NORMAL:
                    I = parseConfigStatement(I, config);
                    break;
                default:
                    Logger.log('Illegal ParagraphHeading: ' + par.getHeading());
                    I++;
            }
        }
        Logger.log('END of parseConfig()');
        return [I, config];
    }
    function parseConfigStatement(I, config) {
        // todo config statement
        I++;
        return I;
    }
    /*
     interface Crawler {
     // context
     blockDepth: 0;
     text: string;
     element: Text;
     indents: number[]; // start indents in points
     // text-related
     bold: boolean;
     italic: boolean;
     output: string;
     runs: number[];
     ibkt1: number; // pos in text of [
     ibkt1c: number; // pos in text of ]
     }
     function applyIndent(textIndent: number): void {
     const indents = this.indents;
     while (textIndent < indents[0]) {
     prevText = '';
     if (indents.length <= 1) {
     throw "Indents broke! Are there negatives?"
     }
     if (silentOpenCounter > 0) {
     silentOpenCounter--;
     evalExpr("end", null);
     }
     indents.shift();
     logcode("// applyIndent(" + textIndent + ")-->" + indents.join())
     }
     if (textIndent > indents[0]) {
     prevText = '';
     indents.unshift(textIndent);
     if (doSilentOpen) {
     doSilentOpen = false;
     silentOpenCounter++;
     //evalExpr("silent{",null);
     }
     logcode("// applyIndent(" + textIndent + ")++>" + indents.join())
     }
     }
     function outputFormat(crawler: Crawler, bold2: boolean, italic2: boolean): void {
     if (crawler.bold && !bold2 && crawler.italic) {
     // in case of   <b> xx <i> yy ^ </b> zz </i>
     // replace with <b> xx <i> yy </i> ^ </b> <i> zz </i>
     crawler.italic = false;
     crawler.output += '</i>';
     }
     if (!crawler.bold && bold2) crawler.output += '<b>';
     if (!crawler.italic && italic2) crawler.output += '<i>';
     if (crawler.italic && !italic2) crawler.output += '</i>';
     if (crawler.bold && !bold2) crawler.output += '</b>';
     crawler.bold   = bold2;
     crawler.italic = italic2;
     }
     
     
     const crawler: Crawler = {
     blockDepth: 0,
     bold      : false,
     italic    : false,
     text      : '',
     output    : '',
     element   : null,
     runs      : [],
     indents   : [0], // start indents in points
     ibkt1     : -1, // pos in text of [
     ibkt1c    : -1, // pos in text of ]
     };
     
     const crawler = {
     outputRun    : function (configSection:TConfigSection): void {
     const i1 = this.runs[0];
     const i2 = this.runs[1];
     this.runs.shift();
     if (i2 <= i1) return;
     if (configSection) return;
     const s = this.text.substring(i1, i2);
     this.format(this.element.isBold(i2 - 1), this.element.isItalic(i2 - 1),configSection);
     outputText(s);
     if (options.applyFormat) {
     const sty                                   = {};
     const row                                   = blockDepth > 0 ? GroupStyles[blockDepth * 2 % GroupStyles.length] : GroupStyleZero;
     // sty[DocumentApp.Attribute.BACKGROUND_COLOR] = row[2];
     sty[DocumentApp.Attribute.FOREGROUND_COLOR] = row[1];
     this.element.setAttributes(i1, i2 - 1, sty);
     }
     },
     expr         : function (): string {
     return (this.ibkt1 >= 0 && this.ibkt1c > 0) ? this.text.substring(this.ibkt1 + 1, this.ibkt1c).trim() : null;
     }
     };
     
     function evalExpr(expr: string, crawler: Crawler): void {
     if (prevText === '\n') {
     prevText = '';
     sources.pop();
     }
     doSilentOpen = false;
     const argv   = expr.split(/\s+/);
     const cmd    = argv[0].toLowerCase();
     let arg1str  = expr.substr(cmd.length).replace(/^\s+/, '');
     let myDepth  = blockDepth * 2;
     let myBold   = false;
     let myFont   = null;
     let i, n, s, name;
     if (configSection) {
     myBold = true;
     myFont = 'Consolas';
     switch (cmd) {
     case 'extends':
     setSuperclass(identifier(arg1str));
     break;
     case 'require':
     if (argv.length < 3) throw "Incorrect [require] syntax";
     name = identifier(arg1str.substr(argv[1].length));
     s    = 'override public function ';
     let rt;
     switch (argv[1].toLowerCase()) {
     case 'flag':
     case 'number':
     rt = 'Number';
     break;
     case 'text':
     rt = 'String;';
     break;
     case 'action':
     rt = 'void';
     break;
     default:
     throw "Incorrect [require] type"
     }
     s += (rt === 'void' ? '' : 'get ') + name + '():' + rt + ' {';
     as3log(s);
     indentPlus();
     if (rt === 'void') {
     as3log('super.' + name + '();');
     } else {
     as3log('return super.' + name + ';');
     }
     indentMinus();
     as3log('}');
     break;
     default:
     throw "Unknown config command " + cmd;
     }
     }
     if (crawler && options.applyFormat) {
     const sty = {};
     const row = myDepth > 0 ? GroupStyles[myDepth % GroupStyles.length] : GroupStyleZero;
     
     sty[DocumentApp.Attribute.FOREGROUND_COLOR] = row[1];
     if (myBold !== undefined) sty[DocumentApp.Attribute.BOLD] = myBold;
     sty[DocumentApp.Attribute.FONT_FAMILY] = myFont;
     //sty[DocumentApp.Attribute.BACKGROUND_COLOR] = row[1];
     crawler.element.setAttributes(crawler.ibkt1, crawler.ibkt1c, sty);
     }
     }
     
     */
    function parseParagraph(parts, method, par) {
        for (var ci = 0, cn = par.getNumChildren(); ci < cn; ci++) {
            var c = par.getChild(ci).asText();
            if (!c)
                continue;
            var runs = c.getTextAttributeIndices();
            var text = c.getText();
            runs.push(text.length);
            var comment = text.indexOf('//');
            if (comment >= 0)
                text = text.substring(0, comment);
            var open = findUnescaped(text, '[');
            if (open >= 0)
                Logger.log("Splitting text to runs " + JSON.stringify(runs) + " with first '[' at " + open);
            while (runs.length > 1) {
                if (comment >= 0 && runs[0] >= comment)
                    break;
                if (comment >= 0 && runs[1] > comment)
                    runs[1] = comment;
                if (open >= 0 && open < runs[1]) {
                    var close = void 0;
                    close = findUnescaped(text, ']', open);
                    var open2 = findUnescaped(text, '[', open + 1);
                    if (close < 0 || open2 > 0 && open2 < close) {
                        throw 'Encountered mismatched or complex bracket expression in ' +
                            JSON.stringify(text.substring(0, 20)) + ': ' +
                            '[ at ' + open + (open2 > 0 ? ' and ' + open2 : '') + ', ] at ' + close;
                    }
                    if (runs[0] < open) {
                        // [ xxx '[' yyy ] => [ xxx ] [ '[' yyy ]
                        runs.unshift(runs[0]);
                        runs[1] = open;
                    }
                    else {
                        while (close >= runs[1]) {
                            // [ '[' yyy ] [ zzz ']' www ] => [ '[' yyy zzz ']' www ]
                            if (runs.length <= 2)
                                throw 'Parser broke! ' + JSON.stringify({
                                    runs: runs, open: open, close: close, text: text.substring(runs[0], runs[1])
                                });
                            runs[1] = runs[0];
                            runs.shift();
                        }
                        open = open2;
                        if (close + 1 < runs[1]) {
                            // [ '[' yyy zzz ']' www ] => [ '[' yyy zzz ']' ] [ www ]
                            runs.unshift(runs[0]);
                            runs[1] = close + 1;
                        }
                    }
                }
                if (runs.length < 2)
                    throw 'Parser broke! ' + JSON.stringify({
                        runs: runs, open: open, text: text.substring(runs[0], runs[1])
                    });
                var i1 = runs[0];
                var i2 = runs[1];
                runs.shift();
                if (i2 > i1) {
                    var p = {
                        par: par, element: c, i1: i1, i2: i2,
                        text: text.substring(i1, i2),
                        bold: c.isBold(i2 - 1),
                        italic: c.isItalic(i2 - 1)
                    };
                    //Logger.log(TTextRun.toString(p)); // todo if verbose
                    parts.push(p);
                }
            }
            if (comment >= 0) {
                text = c.getText();
                var p = {
                    par: par, element: c,
                    i1: comment, i2: text.length,
                    text: text.substring(comment),
                    bold: c.isBold(comment),
                    italic: c.isItalic(comment)
                };
                //Logger.log(TTextRun.toString(p));
                parts.push(p);
            }
        }
        if (parts.length > 0 && parts[parts.length - 1].text[0] != '[')
            parts[parts.length - 1].text += '\n';
    }
    function parseMethod(I, file) {
        var p0 = DATA[I++];
        var methodname = cap0(identifier(p0.text));
        if (!methodname) {
            Logger.log('Skipping H3-5 ' + JSON.stringify(p0.text));
            return [I, null];
        }
        Logger.log('parseMethod(' + JSON.stringify(methodname) + ')');
        var method = {
            name: methodname,
            buttons: [],
            returns: false,
            comment: p0.comment,
            file: file,
            statements: []
        };
        var BTNIDX = 0;
        var PARTS = [];
        while (I < N) {
            var par = DATA[I].par;
            if (par.getHeading() != DocumentApp.ParagraphHeading.NORMAL) {
                break;
            }
            // TODO indent?
            parseParagraph(PARTS, method, par);
            I++;
        }
        method.comment = method.comment.trim();
        var M = PARTS.length;
        Logger.log("Found " + M + " text part(s)");
        if (M > 0)
            Logger.log("Last one is " + PARTS[M - 1].i1 + ":" + PARTS[M - 1].i2 + " " + JSON.stringify(PARTS[M - 1].text));
        function reserveButton(btnidx) {
            method.buttons[btnidx] = true;
            while (method.buttons[BTNIDX])
                BTNIDX++;
            return btnidx;
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
        function parseUntil(J, dst, until) {
            var prev = null;
            while (J < M) {
                var stmt = void 0;
                if (until.indexOf('indent') >= 0 && prev) {
                    var myIndent = findIndent(PARTS[J]);
                    var prevIndent = findIndent(prev.run);
                    if (myIndent < prevIndent) {
                        return [J, 'indent', null];
                    }
                }
                _a = parseStatement(J, (prev && prev.type == 'text') ? prev : null, until), J = _a[0], stmt = _a[1];
                if (stmt) {
                    Logger.log(stmt.type + ' ' + JSON.stringify(stmt.run ? stmt.run.text.substr(0, 10) : null));
                    dst.push(stmt);
                    prev = stmt;
                }
                else {
                    if (J < M) {
                        var run = PARTS[J];
                        var tr = extractTagWithRest(run.text);
                        return [J, tr[0], tr[1]];
                    }
                }
            }
            Logger.log("Saved " + dst.length + " statement(s)");
            return [J, null, null];
            var _a;
        }
        function parseIfStatement(J, ifstmt, indentBreak) {
            Logger.log("Parsing [if]");
            var indent = findIndent(ifstmt.run);
            var run, tag, rest;
            _a = parseUntil(J, ifstmt.thenBlock, indentBreak ? ['indent', 'end', 'elseif', 'else'] : ['end', 'elseif', 'else']), J = _a[0], tag = _a[1], rest = _a[2];
            Logger.log("then-block hit [" + tag + ' ' + rest + "] after " + (ifstmt.thenBlock.length) + " statement(s)");
            run = PARTS[J++];
            switch (tag) {
                case 'end':
                    ifstmt.endRun = run;
                    return [J, ifstmt];
                case 'indent':
                    return [J, ifstmt];
                case 'else':
                    if (rest.substring(0, 2).toLowerCase() == 'if') {
                        var expr_1 = identifier(rest.substring(2), REX_EXPR);
                        if (!expr_1)
                            throw "Missing or invalid [else if] expression";
                        ifstmt.elseIfBlock = {
                            type: 'if',
                            run: run,
                            condition: expr_1,
                            thenBlock: [],
                            elseBlock: null,
                            elseIfBlock: null,
                        };
                        Logger.log("adding [else if]:");
                        _b = parseIfStatement(J, ifstmt.elseIfBlock, false), J = _b[0], ifstmt.elseIfBlock = _b[1];
                        return [J, ifstmt];
                    }
                    else {
                        if (rest.trim())
                            throw "Incorrect [else] (not empty, not [else if])";
                        ifstmt.elseRun = run;
                        ifstmt.elseBlock = [];
                        Logger.log("adding [else]:");
                        _c = parseUntil(J, ifstmt.elseBlock, ['end']), J = _c[0], tag = _c[1];
                        if (tag !== 'end') {
                            throw "Unexpected end of input";
                        }
                        ifstmt.endRun = PARTS[J];
                        Logger.log("else-block hit [end] after " + (ifstmt.elseBlock.length) + " statement(s)");
                        J++;
                        return [J, ifstmt];
                    }
                case 'elseif':
                    var expr = identifier(rest, REX_EXPR);
                    if (!expr)
                        throw "Missing or invalid [if] expression";
                    ifstmt.elseIfBlock = {
                        type: 'if',
                        run: run,
                        condition: expr,
                        thenBlock: [],
                        elseBlock: null,
                        elseIfBlock: null,
                    };
                    Logger.log("adding [elseif]:");
                    _d = parseIfStatement(J, ifstmt.elseIfBlock, false), J = _d[0], ifstmt.elseIfBlock = _d[1];
                    return [J, ifstmt];
                default:
                    throw "Unexpected end of input; " + tag;
            }
            var _a, _b, _c, _d;
        }
        function parseStatement(J, prev, stop) {
            var run = PARTS[J++];
            //Logger.log(" "+TTextRun.toString(run)); // todo if verbose
            var match;
            if ((match = run.text.match(/^\s*\/\/(.*)/))) {
                Logger.log('//comment: ' + JSON.stringify(match[1].substring(0, 20)));
                return [J, {
                        type: 'comment',
                        comment: match[1],
                        run: run
                    }];
            }
            else if (run.text[0] === '[') {
                var _a = extractTagWithRest(run.text), tagname = _a[0], rest = _a[1];
                if (tagname) {
                    var argid = identifier(rest);
                    Logger.log("[" + tagname + "]");
                    switch (tagname) {
                        case 'end':
                        case 'elseif':
                        case 'else':
                            if (stop.indexOf(tagname) >= 0) {
                                return [J - 1, null];
                            }
                            else {
                                // todo select line
                                throw "Mismatched [" + tagname + "]";
                            }
                        case 'choice':
                            method.returns = true;
                            var btnidx = void 0;
                            if ((match = rest.match(/^(\d+)\s*/))) {
                                btnidx = reserveButton((+match[1]) + 1);
                                rest = rest.substr(match[0].length);
                            }
                            else {
                                btnidx = reserveButton(BTNIDX);
                            }
                            var btntxt = null;
                            if (match = matchStringLiteral(rest)) {
                                btntxt = match[1];
                                rest = rest.substr(match[0].length);
                            }
                            else if ('“‘"\''.indexOf(rest[0]) >= 0) {
                                // todo select line
                                throw "Missing closing quotes";
                            }
                            var btnfn = identifier(rest, REX_SIMPLE_EXPR);
                            if (!btnfn)
                                throw "Missing or invalid [button] function or expression";
                            if (btntxt === null)
                                btntxt = capX(rest.trim(), 0, ' ');
                            return [J, {
                                    type: 'button',
                                    label: btntxt,
                                    idx: btnidx,
                                    action: btnfn,
                                    run: run
                                }];
                        case 'do':
                            method.returns = true;
                            var expr = identifier(rest, REX_EXPR);
                            if (!expr)
                                throw "Missing or invalid [do] expression";
                            if (expr.indexOf('(') < 0)
                                expr += '()';
                            return [J, {
                                    type: 'exec',
                                    action: expr,
                                    run: run
                                }];
                        case 'continue':
                            method.returns = true;
                            if (!argid)
                                throw "Missing or invalid [continue] function";
                            return [J, {
                                    type: 'call',
                                    action: argid,
                                    run: run
                                }];
                        case 'next':
                            method.returns = true;
                            if (!argid)
                                throw "Missing or invalid [next] function";
                            return [J, {
                                    type: 'button',
                                    label: 'Next',
                                    idx: reserveButton(BTNIDX),
                                    action: argid,
                                    run: run
                                }];
                        case 'camp':
                            method.returns = true;
                            match = matchStringLiteral(rest);
                            return [J, {
                                    type: 'button',
                                    label: match ? match[1] : 'Next',
                                    idx: reserveButton(BTNIDX),
                                    action: 'camp.returnToCampUseOneHour',
                                    run: run
                                }];
                        case 'if': {
                            if (rest[0] === '(') {
                                return [J, {
                                        type: 'tag',
                                        text: run.text,
                                        run: run
                                    }];
                            }
                            var expr_2 = identifier(rest, REX_EXPR);
                            if (!expr_2)
                                throw "Missing or invalid [if] expression";
                            var ifstmt = {
                                type: 'if',
                                run: run,
                                condition: expr_2,
                                thenBlock: [],
                                elseBlock: null,
                                elseIfBlock: null,
                            };
                            return parseIfStatement(J, ifstmt, true);
                        }
                    }
                }
                Logger.log("Not a special tag " + JSON.stringify(run.text));
                return [J, {
                        type: 'tag',
                        text: run.text,
                        run: run
                    }];
            }
            else {
                return [J, {
                        type: 'text',
                        text: run.text,
                        run: run
                    }];
            }
        }
        var j = 0;
        parseUntil(0, method.statements, []);
        /*
         if (crawler.blockDepth > 0) {
         // todo select block
         // doc.setSelection(doc.newRange().addElement(par).build());
         throw "Unterminated block";
         }
         if (!method.returns) {
         // todo select prev element
         // doc.setSelection(doc.newRange().addElement(par).build());
         throw "No [continue ...], [camp], [next ...], or [choice ...] tags"
         }
         */
        Logger.log("END of parseMethod()");
        return [I, method];
    }
    var body = doc.getBody();
    var files = [];
    for (var i = 0, n = body.getNumChildren(); i < n; i++) {
        if (body.getChild(i).getType() !== DocumentApp.ElementType.PARAGRAPH)
            continue;
        var par = body.getChild(i).asParagraph();
        var _a = uncomment(par.getText()), text = _a[0], comment = _a[1];
        DATA.push({ par: par, text: text, comment: comment });
    }
    N = DATA.length;
    Logger.log("Found " + N + " paragraph(s)");
    for (var I = 0; I < N;) {
        if (DATA[I].par.getHeading() == DocumentApp.ParagraphHeading.HEADING2) {
            var file = void 0;
            _b = parseFile(I), I = _b[0], file = _b[1];
            if (file)
                files.push(file);
        }
        else {
            I++;
        }
    }
    Logger.log("END of parseDocument()");
    return files;
    var _b;
}
/*
 * Created by aimozg on 18.06.2017.
 * Confidential until published on GitHub
 */
function writeSources(files) {
    var sources = [];
    var tabs = '';
    var blockDepth = 0;
    var eol = true;
    function as3(loc) {
        sources.push(tabs + loc);
        return sources.length - 1;
    }
    function logcode(loc) {
        Logger.log(':' + sources.length + ' <' + blockDepth + '>\t' + loc);
    }
    function markNotEol() {
        eol = false;
    }
    function as3log(loc) {
        if (!eol) {
            sources[sources.length - 1] += loc;
            logcode(loc);
            eol = true;
        }
        else {
            sources.push(tabs + loc);
            logcode(loc);
        }
    }
    function indentPlus() {
        tabs += '\t';
    }
    function indentMinus() {
        tabs = tabs.substring(1);
    }
    function writeComment(comment) {
        comment = comment.trim();
        if (comment.indexOf('\n') < 0) {
            as3('// ' + comment);
        }
        else {
            as3('/*');
            for (var _i = 0, _a = comment.split('\n'); _i < _a.length; _i++) {
                var l = _a[_i];
                as3(' * ' + l);
            }
            as3('*/');
        }
    }
    function appendOutput(ctx, text) {
        ctx.output += text;
    }
    function flushFormat(ctx, bold2, italic2) {
        if (ctx.bold && !bold2 && ctx.italic) {
            // in case of   <b> xx <i> yy ^ </b> zz </i>
            // replace with <b> xx <i> yy </i> ^ </b> <i> zz </i>
            ctx.italic = false;
            ctx.output += '</i>';
        }
        if (!ctx.bold && bold2)
            ctx.output += '<b>';
        if (!ctx.italic && italic2)
            ctx.output += '<i>';
        if (ctx.italic && !italic2)
            ctx.output += '</i>';
        if (ctx.bold && !bold2)
            ctx.output += '</b>';
        ctx.bold = bold2;
        ctx.italic = italic2;
    }
    function flushOutput(ctx) {
        var s = ctx.output;
        var s2 = '';
        while (s) {
            var i = 0;
            while (s[i] == '\n')
                i++;
            i = s.indexOf('\n', i);
            if (i < 0 || i == s.length - 1) {
                break;
            }
            else {
                if (s2)
                    as3('outputText(' + JSON.stringify(s2) + ');');
                s2 = s.substring(0, i);
                s = s.substring(i);
            }
        }
        s += s2;
        if (s) {
            as3('outputText(' + JSON.stringify(s) + ');');
        }
        ctx.output = '';
    }
    function closeContext(ctx) {
        flushOutput(ctx);
        flushFormat(ctx, false, false);
    }
    function writeStatement(ctx, stmt) {
        Logger.log('<' + ctx.depth + '>\t' + stmt.type + ' ' + JSON.stringify(stmt.run ? stmt.run.text.substr(0, 10) : null));
        if (stmt.type == 'text' || stmt.type == 'tag') {
            var text = stmt.run.text;
            if (text) {
                flushFormat(ctx, stmt.run.bold, stmt.run.italic);
                appendOutput(ctx, text);
            }
        }
        else {
            closeContext(ctx);
        }
        switch (stmt.type) {
            case 'text':
            case 'tag':
                break;
            case 'comment':
                writeComment(stmt.comment);
                break;
            case 'button':
                as3log('addButton(' + stmt.idx + ', ' + JSON.stringify(stmt.label) + ', ' + stmt.action + ');');
                break;
            case 'call':
                as3log(stmt.action + '();');
                break;
            case 'exec':
                as3log(stmt.action + ';');
                break;
            case 'if':
                as3log('if (' + stmt.condition + ') {');
                indentPlus();
                ctx.depth++;
                for (var _i = 0, _a = stmt.thenBlock; _i < _a.length; _i++) {
                    var istmt = _a[_i];
                    writeStatement(ctx, istmt);
                }
                closeContext(ctx);
                ctx.depth--;
                indentMinus();
                as3log('}');
                if (stmt.elseIfBlock) {
                    markNotEol();
                    as3log(' else ');
                    markNotEol();
                    writeStatement(ctx, stmt.elseIfBlock);
                }
                else if (stmt.elseBlock) {
                    markNotEol();
                    as3log(' else {');
                    ctx.depth++;
                    indentPlus();
                    for (var _b = 0, _c = stmt.elseBlock; _b < _c.length; _b++) {
                        var istmt = _c[_b];
                        writeStatement(ctx, istmt);
                    }
                    closeContext(ctx);
                    as3log('}');
                }
                break;
            default:
                writeComment("// [ERROR] Unknown stmt type " + stmt['type']);
        }
    }
    for (var _i = 0, files_2 = files; _i < files_2.length; _i++) {
        var file = files_2[_i];
        tabs = '';
        as3('// Start of file "' + file.name + '"');
        as3('// GENERATED CODE - MANUAL CHANGES MAY BE OVERWRITTEN');
        as3('// Generated by Lewd Writer\'s Assistant for Google Docs');
        as3('// Source: ' + (file.document.getUrl() || file.document.getId()));
        as3('package ' + file.path.join('.') + ' {');
        as3('');
        as3('import classes.*');
        as3('');
        if (file.comment)
            writeComment(file.comment);
        as3('public class ' + file.classname + ' extends ' + file.superclass + ' {');
        indentPlus();
        // todo write config
        for (var _a = 0, _b = file.methods; _a < _b.length; _a++) {
            var method = _b[_a];
            as3('');
            if (method.comment)
                writeComment(method.comment);
            as3('public function ' + method.name + '():void {');
            indentPlus();
            as3('clearOutput();');
            as3('menu();');
            // todo write method content
            var ctx = {
                bold: false, italic: false, output: '', depth: 1
            };
            for (var _c = 0, _d = method.statements; _c < _d.length; _c++) {
                var stmt = _d[_c];
                writeStatement(ctx, stmt);
            }
            closeContext(ctx);
            indentMinus();
            as3('}');
        }
        indentMinus();
        as3('}');
        as3('}');
        as3('// End of file "' + file.name + '"');
    }
    as3('');
    return sources;
}
/*
 * Created by aimozg on 18.06.2017.
 * Confidential until published on GitHub
 */
var Document = DocumentApp.Document;
var TTextRun;
(function (TTextRun) {
    function toString(run) {
        return "(" + run.i1 + ":" + run.i2 + " " + (run.bold ? "B" : "") + (run.italic ? "I" : "") +
            " " + JSON.stringify(run.text.substring(0, 100)) + ")";
    }
    TTextRun.toString = toString;
})(TTextRun || (TTextRun = {}));
/*
 * Created by aimozg on 19.06.2017.
 * Confidential until published on GitHub
 */
