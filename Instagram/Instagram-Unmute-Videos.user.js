// ==UserScript==
// @name         Instagram - Unmute videos
// @namespace    _I_UV_
// @version      2024-01-12
// @description  Fix IG's habit of muting videos when you play them.
// @author       zbluebugz (https://github.com/zbluebugz/)
// @match        https://www.instagram.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instagram.com
// @license      MIT; https://opensource.org/licenses/MIT
// @grant        none
// @run-at       document-body
// ==/UserScript==

/*
  Fix up issue with videos being muted by IG when I play a video.
  - Not bullet proof ...
*/

(function() {
    'use strict';

    const postAtt = 'ivum';
//    const log = 'ivum :: ';

    function setVideoEventListener() {

        const videos = document.querySelectorAll('video:not([' + postAtt + '])');
        for (const video of videos) {
            video.addEventListener('play', function() {
               video.muted = false;
            });
            video.setAttribute(postAtt, '1');
        }
        window.setTimeout(setVideoEventListener, 250);
    }

    window.setTimeout(setVideoEventListener, 250);

})();
