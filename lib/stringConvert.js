/*
 * Copyright (c) 2012 Yasin Kuyu - twitter.com/yasinkuyu. All rights reserved.
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
    var EditorManager               = brackets.getModule("editor/EditorManager"),
        CommandManager              = brackets.getModule("command/CommandManager"),
        Menus                       = brackets.getModule("command/Menus"),
        DefaultDialogs              = brackets.getModule("widgets/DefaultDialogs"),
        Dialogs                     = brackets.getModule("widgets/Dialogs"),
        Strings                     = brackets.getModule("strings"),
        InputTemplate               = require("text!htmlContent/input.html"),
        Localize                    = require("strings");

    var STRING_REMOVE_EMPTY_LINES           = "string_remove_empty_lines",
        STRING_REMOVE_BREAK_LINES           = "string_remove_break_lines",
        STRING_REMOVE_LEADING_NEW_LINES     = "string_remove_leading_newlines",
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
        STRING_SEO_URL                      = "string_seo_url";
        
    /* Extension const */
    var commandId                           = "insya-tools",
        menuId                              = "insya-menu",
        moduleName                          = "insya-module-string";
    
    // Selections
    function getSelectedText() {
        var editor = EditorManager.getFocusedEditor();
        if( editor ){
            var selection = editor.getSelection();
            var selectText = editor.getSelectedText();
            return selectText;
        }

    }

    function setSelectedText(text) {
        
        var editor = EditorManager.getFocusedEditor();
        var selection = editor.getSelection();

        //EditorManager.getFocusedEditor()._codeMirror.replaceSelection(text);
        
        editor.document.replaceRange(text, selection.start, selection.end);
    }

    // Line Operations
    function removeBreaklines(){
        
        var result = getSelectedText().replace(/\n/g,''); 
        setSelectedText(result);
        
    }
    
    function removeEmptyLines(){
        
        var result = getSelectedText().replace(/^(\r\n)|(\n)/,'');
        setSelectedText(result);
        
    }
    
    function removeLeadingNewLines(){
        
        var result = getSelectedText().replace(/^\n+/, "");
        setSelectedText(result);
        
    }
     
    function toUppper() {
        setSelectedText(getSelectedText().toUpperCase());
    }

    function toLower() {
        setSelectedText(getSelectedText().toLowerCase());
    }
    
    function toTitle() {
       setSelectedText(getSelectedText().toLowerCase());
    }

    function urlEncode() {
        setSelectedText(encodeURIComponent(getSelectedText()));
    }

    function urlDecode() {
        setSelectedText(decodeURIComponent(getSelectedText()));
    }
    
    function htmlEncode() {
        var result = getSelectedText().replace(/"/g, "&quot;").replace(/'/g, "&#39;");
        setSelectedText(result);
    }

    function htmlDecode() {
        var result = getSelectedText();
        setSelectedText(result);
    }

    function removeLineNumbers() {
        
        var result = getSelectedText();
        var pattern = new RegExp("^\\s*\\d+\\.?", "gm");

        result = result.replace(pattern, "");

        setSelectedText(result);
    }

    function removeDuplicateLines() {
        
        var result = getSelectedText();
        var array = result.split("\n");
        var distinct = new Array();
        
         $(array).each(function(index, item) {
             if ($.inArray(item, distinct) == -1)
                distinct.push(item);
         });
        
        setSelectedText(distinct);
    }
    
    function trim(){
        var result = getSelectedText();
        result = result.replace(/^\s*|\s*$/g, '');

        setSelectedText(result);   
    }
    
    function leftTrim(){
        var result = getSelectedText();
        result = result.replace(/^\s*/, '');

        setSelectedText(result);   
    }
    
    function rightTrim(){
        var result = getSelectedText();
        result = result.replace(/\s*$/, '');

        setSelectedText(result);   
    }
    
    function firstXCharRemove(){
        var result = getSelectedText();

        // This is input data into the template
        var context = {
            Strings: Strings,
            Localize: Localize
        };
        
        // Invoke the dialog from the rendered HTML from the template
        var dialog = Dialogs.showModalDialogUsingTemplate(Mustache.render(InputTemplate, context));
        
        // If you add more buttons and need to know which button was pressed make sure
        dialog.done(function (buttonId) {
            if (buttonId === "ok") {
                result = result.substring(1, result.length);
                setSelectedText(result);
            }
        });
    }
        
    function lastXCharRemove(){
        var result = getSelectedText();

        // This is input data into the template
        var context = {
            Strings: Strings,
            Localize: Localize
        };
        
        // Invoke the dialog from the rendered HTML from the template
        var dialog = Dialogs.showModalDialogUsingTemplate(Mustache.render(InputTemplate, context));
        
        // If you add more buttons and need to know which button was pressed make sure
        dialog.done(function (buttonId) {
            if (buttonId === "ok") {
                result = result.substring(0, result.length-1);
                setSelectedText(result);
                alert("tamam");
            }
        });
        
    }
    
    function seoUrl(){
        var result = getSelectedText();
        
        result = result.replace(/[^a-zA-Z0-9]/g,' ').replace(/\s+/g,"-").toLowerCase();

        /* remove first dash */
        if(result.charAt(0) == '-') 
           result = result.substring(1);
        
        /* remove last dash */
        var last = result.length-1;
        if(result.charAt(last) == '-') 
           result = result.substring(0, last);

        setSelectedText(result);   
    }
        
    function createNavigation(menu) {
        menu.addMenuItem(STRING_REMOVE_EMPTY_LINES);
        menu.addMenuItem(STRING_REMOVE_BREAK_LINES);
        menu.addMenuItem(STRING_REMOVE_LEADING_NEW_LINES);
        menu.addMenuDivider();        
        menu.addMenuItem(STRING_REMOVE_LINE_NUMBERS);
        menu.addMenuItem(STRING_REMOVE_DUPLICATE_LINES);
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
    CommandManager.register(Localize.STRING_REMOVE_LEADING_NEW_LINES, STRING_REMOVE_LEADING_NEW_LINES, removeLeadingNewLines);
 
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

    //var menu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU);
    var menu = Menus.addMenu(Localize.MENU_LABEL, commandId, Menus.BEFORE, Menus.AppMenuBar.HELP_MENU);
    createNavigation(menu);

    var contextMenu = Menus.getContextMenu(Menus.ContextMenuIds.EDITOR_MENU);
    createNavigation(contextMenu);
 
});