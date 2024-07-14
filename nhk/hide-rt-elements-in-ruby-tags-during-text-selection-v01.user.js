// ==UserScript==
// @name         Hide <rt> elements in <ruby> tags during text selection
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide <rt> elements in <ruby> tags during text selection on NHK website
// @author        You
// @match        https://www3.nhk.or.jp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nhk.or.jp
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const isDebugging = true;
    const ATT_PROCESSED = "rt-processed";
    const ATT_TEXT = "data-text";
    let lastSelection = null;

    // -- listen to the selection change events
    document.addEventListener('selectionchange', function() {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);

            if (range.collapsed) {
                // restore the <rt> elements.
                Array.from(document.querySelectorAll(`[${ATT_PROCESSED}]`)).forEach(elParent => {
                    elParent.removeAttribute(ATT_PROCESSED);
                });
                Array.from(document.querySelectorAll(`[${ATT_TEXT}]`)).forEach(rt => {
                    rt.innerText = rt.getAttribute(ATT_TEXT);
                    rt.removeAttribute(ATT_TEXT);
                });
                return;
            }

            // Check if the selection has changed
            if (lastSelection && range.toString() === lastSelection.toString()) {
                return; // Selection hasn't changed, do nothing
            }
            lastSelection = selection.toString();

            // -- get all ruby elements within the selected range
            const rubyElements = getRubyElementsInRange(range);

            rubyElements.forEach(elWrapper => {
                if (elWrapper && !elWrapper.hasAttribute(ATT_PROCESSED)) {
                    const rtElements = elWrapper.querySelectorAll(`rt:not([${ATT_TEXT}])`);
                    rtElements.forEach(rt => {
                        rt.setAttribute(ATT_TEXT, rt.innerText);
                        rt.innerText = "";
                    });
                    elWrapper.setAttribute(ATT_PROCESSED, "1");
                }
            });

             // Output the selected text without <rt> elements
            if (isDebugging) {
                const selectedText = selection.toString();
                console.log('Selected text (without rt):', selectedText);
            }

        }
    });

    function getRubyElementsInRange(range) {
        const rubyElements = [];
        const startContainer = range.startContainer.nodeType === Node.TEXT_NODE
        ? range.startContainer.parentElement.closest('ruby')
        : range.startContainer.closest('ruby');
        const endContainer = range.endContainer.nodeType === Node.TEXT_NODE
        ? range.endContainer.parentElement.closest('ruby')
        : range.endContainer.closest('ruby');

        if (startContainer === endContainer) {
            // Selection is within a single <ruby> element
            if (startContainer) {
                rubyElements.push(startContainer);
            }
        } else {
            // Selection spans multiple <ruby> elements
            let currentNode = startContainer;
            while (currentNode && currentNode !== endContainer) {
                if (currentNode.nodeName === 'RUBY') {
                    rubyElements.push(currentNode);
                }
                currentNode = getNextNode(currentNode);
            }
            // Include endContainer if it's a <ruby> element
            if (endContainer && endContainer.nodeName === 'RUBY') {
                rubyElements.push(endContainer);
            }
        }

        return rubyElements;
    }

    function getNextNode(node) {
        if (node.nextSibling) {
            return node.nextSibling;
        }
        while (node.parentNode) {
            node = node.parentNode;
            if (node.nextSibling) {
                return node.nextSibling;
            }
        }
        return null;
    }
})();
