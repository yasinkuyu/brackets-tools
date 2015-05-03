/* Copyright (c) 2012 Yasin Kuyu - twitter.com/yasinkuyu. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 */

/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, brackets, window, $, Mustache, navigator */

define(function (require, exports, module) {
    'use strict';

    // Brackets modules
    var EditorManager                       = brackets.getModule("editor/EditorManager"),
        DocumentManager                     = brackets.getModule("document/DocumentManager"),
        CommandManager                      = brackets.getModule("command/CommandManager"),
        Menus                               = brackets.getModule("command/Menus"),
        Dialogs                             = brackets.getModule("widgets/Dialogs"),
        Strings                             = brackets.getModule("strings"),
        InputTemplate                       = require("text!htmlContent/input.html"),
        Localize                            = require("strings");

    // Localize strings
    var STRING_REMOVE_EMPTY_LINES           = "string_remove_empty_lines",
        STRING_REMOVE_BREAK_LINES           = "string_remove_break_lines",
        STRING_UPPERCASE                    = "string_uppercase",
        STRING_LOWERCASE                    = "string_lowercase",
        STRING_TITLECASE                    = "string_titlecase",
        STRING_HTML_ENCODE                  = "string_html_encode",
        STRING_HTML_DECODE                  = "string_html_decode",
        STRING_ENCODE_URI                   = "string_encode_uri_component",
        STRING_DECODE_URI                   = "string_decode_uri_component",
        STRING_REMOVE_LINE_NUMBERS          = "string_remove_line_numbers",
        STRING_REMOVE_DUPLICATE_LINES       = "string_remove_duplicate_lines",
        STRING_TRIM                         = "string_trim",
        STRING_LTRIM                        = "string_ltrim",
        STRING_RTRIM                        = "string_rtrim",
        STRING_FxCHAR_REMOVE                = "string_fxchar_remove",
        STRING_LxCHAR_REMOVE                = "string_lxchar_remove",
        STRING_HTML_TAG_STRIP               = "string_html_tag_strip",
        STRING_WORD_TO_ARRAY                = "string_word_to_array",
        STRING_WORD_TO_LIST                 = "string_word_to_list",
        STRING_LINE_TO_LIST                 = "string_line_to_list",
        STRING_SEO_URL                      = "string_seo_url";
        
    /* Extension const */
    var commandId                           = "insya-tools";

    // This is input data into the template
    var context = {
        Strings: Strings,
        Localize: Localize
    };

    /* Extension's preferences */
    //var prefs = PreferencesManager.getExtensionPrefs(moduleName);

    /**
     * Editor get select area or all text.
     *
     */
    function _get(){
        
        var editor = EditorManager.getCurrentFullEditor();
        
        if (editor) {
            var content;
            var selectedText = editor.getSelectedText();
    
            if (selectedText.length > 0) {
                content = selectedText;
            } else {
                content = DocumentManager.getCurrentDocument().getText();
            }
            
            return content;
        }
        
    }
    
    /**
     * @function _getMultiple -- returns array of strings selected with multiple cursors
     */
    
    function _getMultiple(){
        var editor = EditorManager.getCurrentFullEditor();
        if (!editor) return [];
        
        var doc = DocumentManager.getCurrentDocument();
        
        return editor.getSelections().map(function(selection){
            return doc.getRange(selection.start, selection.end);
        });
    }

    /**
     * Editor set select area or all text.
     * @param result content
     */
    function _set(result){
        
        var editor = EditorManager.getCurrentFullEditor();
        
        if (editor) {
            var isSelection = false;
            var selectedText = editor.getSelectedText();
            var selection = editor.getSelection();
    
            if (selectedText.length > 0) {
                isSelection = true;
            } else {
            }
            
            var doc = DocumentManager.getCurrentDocument();
            
            doc.batchOperation(function () {

                if (isSelection) {
                    doc.replaceRange(result, selection.start, selection.end);
                } else {
                    doc.setText(result);
                }

            });
        }        
    }
    
    /**
     * @function _setMultiple - fills mulltiple selected ranges with provided text
     * @param {array<String>} - array with text selection to be replaced with; the length
     *                          of this array must be equal the length of selections array
     */
    
    function _setMultiple(result){
        var editor = EditorManager.getCurrentFullEditor();
        if (!editor) return;
        
        var selections = editor.getSelections();
        var doc = DocumentManager.getCurrentDocument();
        
        selections.forEach(function(selection, index){
            doc.replaceRange(result[index], selection.start, selection.end);
        });
    }
     
    function removeBreaklines(){
        
        var result = _get().replace(/\n/g,''); 
        _set(result);
        
    }

    function removeEmptyLines(){

        var result = _get().replace(/^\s*$[\n\r]{1,}/gm, '');
        _set(result);
        
    }
 
    function toUppper() {
        
        var result = _getMultiple().map(function(str){
            return str.toUpperCase();
        }); 
        _setMultiple(result);
    }

    function toLower() {
        
        var result = _getMultiple().map(function(str){
            return str.toLowerCase();
        }); 
        _setMultiple(result);
    }
    
    function toTitle() {
        var result = _getMultiple().map(function(str){
            str = str.toLowerCase().replace(/_/g, ' ');
            return str.replace(/\b([a-z\u00C0-\u00ff])/g, function (_, initial) {
                return initial.toUpperCase();
            }).replace(/(\s(?:de|a|o|e|da|do|em|ou|[\u00C0-\u00ff]))\b/ig, function (_, match) {
                return match.toLowerCase();
            });
        }); 
        
        _setMultiple(result);
    }

    function urlEncode() {
        var result = encodeURIComponent(_get());
        _set(result);
    }

    function urlDecode() {
        var result = decodeURIComponent(_get());
        _set(result);
    }
    
    function htmlEncode() {
        
        var result = _get();
        var div = document.createElement('div');
        
        div.textContent = result;
        result =  div.innerHTML;

        _set(result);
    }

    function htmlDecode() {
        
        var result = _get();
        var div = document.createElement('div');
        
        div.innerHTML = result;
        result = div.textContent;
        
        _set(result);
    }
    
    function htmlTagStrip() {
        var result = _get().replace(/(<([^>]+)>)/ig,"");
        _set(result);
    }

    function removeLineNumbers() {
        
        var pattern = new RegExp("^\\s*\\d+\\.?", "gm");
        var result = _get().replace(pattern, "");
        
        _set(result);
        
    }

    function removeDuplicateLines()
    {
        var result  = [],
            dist    = [],
            text    = _get(),
            lines   = text.split('\n');

        lines.forEach(function (line) {
         	if ($.inArray(line, dist) == -1) {
                dist.push(line);
                result.push(line);
            }
        });

        result = result.join("\n");
        
        _set(result);
    }
	
    function trim(){
        
        var result = _get();
        result = result.replace(/^\s*|\s*$/g, '');

        _set(result);   
    }
    
    function leftTrim(){
        
        var result = _get();
        result = result.replace(/^\s*/, '');

        _set(result);   
    }
    
    function rightTrim(){
        
        var result = _get();
        result = result.replace(/\s*$/, '');

        _set(result);   
    }
    
    function firstXCharRemove(){
        
        // Invoke the dialog from the rendered HTML from the template
        var dialog = Dialogs.showModalDialogUsingTemplate(Mustache.render(InputTemplate, context));
 
        // If you add more buttons and need to know which button was pressed make sure
        dialog.done(function(id) {
            if (id == "ok") {
                
                var num = dialog.getElement();
                num = num.find('input').val();

                var result  = [],
                    dist    = [],
                    text    = _get(),
                    lines   = text.split('\n');

                lines.forEach(function (line) {
                     if(line.length > 0 )
                        line = line.substring(num, line.length);
                        dist.push(line);
                        result.push(line);
                });
                
                result = result.join("\n");

                _set(result); 
                
            }
        });
    }
        
    function lastXCharRemove(){
        
        // Invoke the dialog from the rendered HTML from the template
        var dialog = Dialogs.showModalDialogUsingTemplate(Mustache.render(InputTemplate, context));

        // If you add more buttons and need to know which button was pressed make sure
        dialog.done(function(id) {
            if (id == "ok") {
 
                var num = dialog.getElement();
                num = num.find('input').val();

                var result  = [],
                    dist    = [],
                    text    = _get(),
                    lines   = text.split('\n');

                lines.forEach(function (line) {
                     if(line.length > 0 )
                        line = line.substring(0, line.length-num);
                        dist.push(line);
                        result.push(line);
                   
                });
                
                result = result.join("\n");

                _set(result);
            }
        });
    }
    
    function seoUrl(){
        
        var result = _get();
        result = result.replace(/[^a-zA-Z0-9]/g,' ').replace(/\s+/g,"-").toLowerCase();

        /* remove first dash */
        if(result.charAt(0) == '-') 
           result = result.substring(1);
        
        /* remove last dash */
        var last = result.length-1;
        if(result.charAt(last) == '-') 
           result = result.substring(0, last);

        _set(result);   
    }
    
    function listProcess(text, split)
    {
        var result  = [],
            lines   = text.split(split);

        lines.forEach(function (line) {
            if(line.length > 0){
                line = "\t<li>"+ line +"</li>";
                result.push(line);
            }
        });

        result = "<ul>\n"+ result.join("\n") +"\n</ul>";

        return result;
    }
    
    function arrayProcess(text, split)
    {
        var result  = [],
            lines   = text.split(split);

        lines.forEach(function (line) {
            if(line.length > 0){
                line = '"'+ line +'"';
                result.push(line);
            }
        });

        result = "[\n\t"+ result.join(", ") +"\n]";

        return result;
    }
         
    function wordToArray()
    {
        var result = _get().replace(/\n/g,' '); 

        result  = arrayProcess(result, " "); 

        _set(result);
    }
    
    function wordToList()
    {
        var result = _get().replace(/\n/g,' '); 

        result  = listProcess(result, " "); 

        _set(result);
    }
    
    
    function lineToList()
    {
        var result  = listProcess(_get(), "\n");

        _set(result);
    }

    function createNavigation(menu) {
        menu.addMenuItem(STRING_REMOVE_EMPTY_LINES);
        menu.addMenuItem(STRING_REMOVE_BREAK_LINES);
        menu.addMenuDivider();        
        menu.addMenuItem(STRING_REMOVE_LINE_NUMBERS);
        menu.addMenuItem(STRING_REMOVE_DUPLICATE_LINES);        
        menu.addMenuDivider();        
        menu.addMenuItem(STRING_WORD_TO_ARRAY);
        menu.addMenuItem(STRING_WORD_TO_LIST);
        menu.addMenuItem(STRING_LINE_TO_LIST);
        menu.addMenuDivider();
        menu.addMenuItem(STRING_HTML_TAG_STRIP);
        menu.addMenuDivider();        
        menu.addMenuItem(STRING_TRIM);
        menu.addMenuItem(STRING_LTRIM);
        menu.addMenuItem(STRING_RTRIM);
        menu.addMenuDivider();        
        menu.addMenuItem(STRING_FxCHAR_REMOVE);
        menu.addMenuItem(STRING_LxCHAR_REMOVE);
        menu.addMenuDivider();    
        menu.addMenuItem(STRING_SEO_URL);
        menu.addMenuDivider();
        menu.addMenuItem(STRING_UPPERCASE);
        menu.addMenuItem(STRING_LOWERCASE);
        menu.addMenuItem(STRING_TITLECASE);
        menu.addMenuDivider();
        menu.addMenuItem(STRING_HTML_ENCODE);
        menu.addMenuItem(STRING_HTML_DECODE);
        menu.addMenuDivider();
        menu.addMenuItem(STRING_ENCODE_URI);
        menu.addMenuItem(STRING_DECODE_URI);
    }

    CommandManager.register(Localize.STRING_REMOVE_EMPTY_LINES, STRING_REMOVE_EMPTY_LINES, removeEmptyLines);
    CommandManager.register(Localize.STRING_REMOVE_BREAK_LINES, STRING_REMOVE_BREAK_LINES, removeBreaklines);
 
    CommandManager.register(Localize.STRING_REMOVE_LINE_NUMBERS, STRING_REMOVE_LINE_NUMBERS, removeLineNumbers);
    CommandManager.register(Localize.STRING_REMOVE_DUPLICATE_LINES, STRING_REMOVE_DUPLICATE_LINES, removeDuplicateLines);
  
    CommandManager.register(Localize.STRING_UPPERCASE, STRING_UPPERCASE, toUppper);
    CommandManager.register(Localize.STRING_LOWERCASE, STRING_LOWERCASE, toLower);
    CommandManager.register(Localize.STRING_TITLECASE, STRING_TITLECASE, toTitle);
    
    CommandManager.register(Localize.STRING_TRIM, STRING_TRIM, trim);
    CommandManager.register(Localize.STRING_LTRIM, STRING_LTRIM, leftTrim);
    CommandManager.register(Localize.STRING_RTRIM, STRING_RTRIM, rightTrim);
    
    CommandManager.register(Localize.STRING_FxCHAR_REMOVE, STRING_FxCHAR_REMOVE, firstXCharRemove);
    CommandManager.register(Localize.STRING_LxCHAR_REMOVE, STRING_LxCHAR_REMOVE, lastXCharRemove);
        
    CommandManager.register(Localize.STRING_SEO_URL, STRING_SEO_URL, seoUrl);
    
    CommandManager.register(Localize.STRING_HTML_ENCODE, STRING_HTML_ENCODE, htmlEncode);
    CommandManager.register(Localize.STRING_HTML_DECODE, STRING_HTML_DECODE, htmlDecode);
    
    CommandManager.register(Localize.STRING_ENCODE_URI, STRING_ENCODE_URI, urlEncode);
    CommandManager.register(Localize.STRING_DECODE_URI, STRING_DECODE_URI, urlDecode);
    
    CommandManager.register(Localize.STRING_HTML_TAG_STRIP, STRING_HTML_TAG_STRIP, htmlTagStrip);

    CommandManager.register(Localize.STRING_WORD_TO_ARRAY, STRING_WORD_TO_ARRAY, wordToArray);
    CommandManager.register(Localize.STRING_WORD_TO_LIST, STRING_WORD_TO_LIST, wordToList);
    CommandManager.register(Localize.STRING_LINE_TO_LIST, STRING_LINE_TO_LIST, lineToList);
    
    //var menu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU);
    var menu = Menus.addMenu(Localize.MENU_LABEL, commandId, Menus.BEFORE, Menus.AppMenuBar.HELP_MENU);
    createNavigation(menu);

    var contextMenu = Menus.getContextMenu(Menus.ContextMenuIds.EDITOR_MENU);
    createNavigation(contextMenu);
 
});