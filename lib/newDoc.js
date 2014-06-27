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

    
    var docIndex                    = 1,
        commandId                   = "insya.newdoc.cmd",
        html5File                   = "insya.newhtml5";

    // Brackets modules
    var DocumentManager             = brackets.getModule("document/DocumentManager"),
        Commands                    = brackets.getModule("command/Commands"),
        CommandManager              = brackets.getModule("command/CommandManager"),
        KeyBindingManager           = brackets.getModule("command/KeyBindingManager"),
        EditorManager               = brackets.getModule("editor/EditorManager"),
        Menus                       = brackets.getModule("command/Menus");

    // Template file
    var Html5Template               = require("text!htmlContent/html5.html"),
        Localize                    = require("strings");
    
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

    // Register command
    CommandManager.register(Localize.MENU_NEW_DOC, html5File, handleFileNew);

    // Set menu
    var menu = Menus.getMenu(Menus.AppMenuBar.FILE_MENU);
    menu.addMenuItem(html5File, undefined, Menus.AFTER, Commands.FILE_NEW_UNTITLED);

    // Shortcut add binding
    KeyBindingManager.addBinding(commandId, "Ctrl-Alt-N", "mac");
    KeyBindingManager.addBinding(commandId, "Ctrl-Alt-N", "win");

});