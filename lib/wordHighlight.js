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
/*global define, $, brackets, window */

define(function (require, exports, module) {
    "use strict";

    var EditorManager       = brackets.getModule("editor/EditorManager"),
        Menus               = brackets.getModule("command/Menus"),
        PreferencesManager  = brackets.getModule("preferences/PreferencesManager"),
        Localize            = require("strings");
          
    /* Extension const */
    var commandId          = "insya-highlighter",
        moduleName         = "insya-module-highlighter",
        prefs              = PreferencesManager.getExtensionPrefs(moduleName);
    
    
    prefs.definePreference("enabled", "boolean", false);

    var isEnabled = prefs.get("enabled");
    
    function attachHighlighter(){        
        $(EditorManager).on("activeEditorChange", function(e, activeEditor, prevEditor){              
            setEditorHighlighted(activeEditor, true);
            setEditorHighlighted(prevEditor, false);
        });
    }
    
    function setEditorHighlighted(editor, enabled){
        if (!editor) {
            return;
        }
        
        var cm = editor._codeMirror;
        cm.setOption("highlightSelectionMatches", (isEnabled && enabled) ? {showToken:true}: false);
    }
     
    function toggleHighlighter(){
        var editor = EditorManager.getActiveEditor();
        
        isEnabled = !isEnabled;
        prefs.set("enabled", isEnabled);
        prefs.save();
        
        setEditorHighlighted(editor, true);
        setChecked(isEnabled);
    }
    
    function registerCommand(){
        var CommandManager  = brackets.getModule("command/CommandManager");
        var command = CommandManager.register(Localize.VIEW_HIGHLIGHT, commandId, toggleHighlighter);
        command.setChecked(isEnabled);
    
        var menu = Menus.getMenu(Menus.AppMenuBar.VIEW_MENU);
        menu.addMenuItem(Menus.DIVIDER);
        menu.addMenuItem(commandId);
    }
    
    attachHighlighter();
    registerCommand();
    
});