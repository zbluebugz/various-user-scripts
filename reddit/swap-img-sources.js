// ==UserScript==
// @name         reddit - swap img.src (v0.3)
// @namespace    reddit_swap_img_src
// @version      0.3
// @description  Switch reddit's image src from preview.redd.it to i.redd.it, including their parent A.
// @author       You
// @match        https://www.reddit.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAANUlEQVRIS+3SsQkAAAwCQd1/aUf4yu5TS4TD5nw9/48FKCyRRCiAAVckEQpgwBVJhAIYuK9oesQAGQOvmYAAAAAASUVORK5CYII=
// @noframes
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    const LOG_NAME = 'Swap img.src; ';

    const FIND_SRC = '//preview.redd.it';
    const REPLACE_SRC = '//i.redd.it';

    function updateImagesSrc() {
        const previewImages = document.querySelectorAll(`img[src*="${FIND_SRC}"]`);

        // console.info(LOG_NAME + 'found: ' + previewImages.length + ' preview.redd.it images');

        previewImages.forEach((previewImage) => {
            // console.info(LOG_NAME + ' updating image:', previewImage);
            previewImage.src = previewImage.src.replace(FIND_SRC, REPLACE_SRC);

            // -- the following line is used for checking the img in the devtools console.
            previewImage.setAttribute('rsisrc', '1');
            // -- in devtools console, the following snippet will list all images touched by this script.
            // -- document.querySelectorAll('img[rsisrc]')

            // -- check if img is wrapped inside an A tag .. if so, update the A's href attribute
            let elLink = previewImage.closest(`figure > a[href*="${FIND_SRC}"]`);
            if (elLink !== null) {
                elLink.href = elLink.href.replace(FIND_SRC, REPLACE_SRC);
            }

        })

    }

    // -- use Mutations processor to monitor when new elements are being loaded
    let counter = 0;
    function runBodyMO() {
        // -- observe the BODY for changes
        if (document.body) {
            // -- configuration for the MutationObserver
            const observerConfig = { childList: true, subtree: true, attributes: false };

            // -- create a MutationObserver instance
            const observer = new MutationObserver((mutationsList, observer) => {
                for (const mutation of mutationsList) {
                    if ((mutation.type === 'childList') && (mutation.addedNodes.length > 0)) {
                        for (const nodeAdded of mutation.addedNodes) {
                            if (nodeAdded.tagName === 'DIV') {
                                // console.info(LOG_NAME + 'added Node::', nodeAdded);
                                updateImagesSrc();
                            }
                        }
                    }
                }
            });

            // -- start observing mutations on the document.body
            observer.observe(document.body, observerConfig);
        }
        else {
            // -- BODY not yet available ... page is still loading ...
            // -- try again in a few ms ... max 50 times
            counter++;
            if (counter < 51) {
                setTimeout(runBodyMO, 15);
            }
        }
    }
    runBodyMO();

})();
