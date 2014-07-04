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
    var AppInit         = brackets.getModule("utils/AppInit"),
        EditorManager   = brackets.getModule("editor/EditorManager"),
        DocumentManager = brackets.getModule("document/DocumentManager");
    
    /* Extension const */
    var pattern         = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;

    /**
     * Url Detect
     * htttp://www.domain.com to <a href="http://domain.com">http://domain.com</a>
     * @param text
     */    
    function urlDetect(text) {

        return text.replace(pattern, function(url) {
            return '<a href="' + url + '" class="autolink">' + url + '</a>';
        });

    }
  
    /**
     * Auto Link.
     */
    function autoLink() {
        
        var editor = EditorManager.getCurrentFullEditor();
        
        if (editor) {
            var unformattedText, isSelection = false;
            var selectedText = editor.getSelectedText();
            var selection = editor.getSelection();
    
            if (selectedText.length > 0) {
                isSelection = true;
                unformattedText = selectedText;
            } else {
                unformattedText = DocumentManager.getCurrentDocument().getText();
            }
            
            var formattedText = urlDetect(unformattedText);
            var doc = DocumentManager.getCurrentDocument();
            
            doc.batchOperation(function () {

                if (isSelection) {
                    doc.replaceRange(formattedText, selection.start, selection.end);
                } else {
                    doc.setText(formattedText);
                }

            });
        }
    }
    
    
    /**
     * This function is registered with EditManager as an inline editor provider. It creates an inline editor
     * when cursor is on a JavaScript function name, find all functions that match the name
     * and show (one/all of them) in an inline editor.
     *
     * @param {!Editor} editor
     * @param {!{line:Number, ch:Number}} pos
     * @return {$.Promise} a promise that will be resolved with an InlineWidget
     *      or null if we're not going to provide anything.
     */
     function autoLinkProvider(hostEditor, pos) {
        
        // Only provide JavaScript editor if the selection is within a single line
        var sel = hostEditor.getSelection();
        if (sel.start.line !== sel.end.line) {
            return null;
        }
         
        var result = new $.Deferred();

        result.resolve(autoLink);
        
        return result.promise();
    }
    
    EditorManager.registerInlineEditProvider(autoLinkProvider);

});
  
 