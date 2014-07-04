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

/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, brackets, window, $, Mustache, navigator */

define(function (require, exports, module) {
    "use strict";

    // Brackets modules
    var AppInit                     = brackets.getModule("utils/AppInit"),
        KeyEvent 	  	   	        = brackets.getModule("utils/KeyEvent"),
        DocumentManager             = brackets.getModule("document/DocumentManager"),
        Commands                    = brackets.getModule("command/Commands"),
        CommandManager              = brackets.getModule("command/CommandManager"),
        EditorManager               = brackets.getModule("editor/EditorManager"),
        KeyBindingManager           = brackets.getModule("command/KeyBindingManager"),
        Menus                       = brackets.getModule("command/Menus");

    // Template file
    var Html5Template               = require("text!htmlContent/html5.html"),
        Localize                    = require("strings"),
        docIndex                    = 1,
        moduleName                  = "insya.newhtml5";
    
    // Brackets elements
    var sidebar                     = $("#sidebar"),
        toolbar                     = $("#main-toolbar");

 	// Create Untitled Document function
    function handleFileNew()
	{
        var doc = DocumentManager.createUntitledDocument(docIndex++, ".html");
        DocumentManager.setCurrentDocument(doc);
        EditorManager.focusEditor();
        doc.setText(Html5Template);

    }

    // Sidebar double-click event
    sidebar.on('dblclick', 'div', function(e) {

        // if not children element
        if (e.target === this) {
            handleFileNew();
        }

    });

    // Toolbar double-click event
    toolbar.on('dblclick', function(e) {

        // if not children element
        if (e.target === this) {
            handleFileNew();
        }

    });
    
    var parseLine = function (line, cursorPosition) {
        var words;
        line = line.substring(0, cursorPosition);
        words = line.split(/\W/);
        return words[words.length - 1];
    };
                
    var keyEventHandler = function ($event, editor, event) {
        
        var cursorPosition,
            line,
            readLine,
            start;
        
        if ((event.type === "keydown") && (event.keyCode === KeyEvent.DOM_VK_TAB)) {
            cursorPosition = editor.getCursorPos();
            line = editor.document.getLine(cursorPosition.line);
            readLine = parseLine(line, cursorPosition.ch);
            
            if(readLine === "html5")
            {
                start = {
                    line: cursorPosition.line,
                    ch: cursorPosition.ch - readLine.length
                };
                editor.document.replaceRange(Html5Template, start, cursorPosition);
                event.preventDefault();
            }
        }
    };

    AppInit.appReady(function () {

        // Register command
        CommandManager.register(Localize.MENU_NEW_DOC, moduleName, handleFileNew);

        // Set menu
        var menu = Menus.getMenu(Menus.AppMenuBar.FILE_MENU);
        menu.addMenuItem(moduleName, undefined, Menus.AFTER, Commands.FILE_NEW_UNTITLED);

        // Key event
        var currentEditor = EditorManager.getCurrentFullEditor();
        $(currentEditor).on('keyEvent', keyEventHandler);
        
    });
    
});