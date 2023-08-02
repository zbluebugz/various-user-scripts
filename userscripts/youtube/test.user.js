// ==UserScript==
// @name         YouTube - sort a channel's search results by upload date
// @namespace    YT-sort-channel-search-results
// @version      0.5
// @description  Sort a YT channel search results by upload date
// @author       You
// @match        https://www.youtube.com/*
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+Cgo8ZGVmcz4KPC9kZWZzPgo8ZyBzdHlsZT0ic3Ryb2tlOiBub25lOyBzdHJva2Utd2lkdGg6IDA7IHN0cm9rZS1kYXNoYXJyYXk6IG5vbmU7IHN0cm9rZS1saW5lY2FwOiBidXR0OyBzdHJva2UtbGluZWpvaW46IG1pdGVyOyBzdHJva2UtbWl0ZXJsaW1pdDogMTA7IGZpbGw6IG5vbmU7IGZpbGwtcnVsZTogbm9uemVybzsgb3BhY2l0eTogMTsiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEuNDA2NTkzNDA2NTkzNDAxNiAxLjQwNjU5MzQwNjU5MzQwMTYpIHNjYWxlKDIuODEgMi44MSkiID4KCTxwYXRoIGQ9Ik0gODguMTE5IDIzLjMzOCBjIC0xLjAzNSAtMy44NzIgLTQuMDg1IC02LjkyMiAtNy45NTcgLTcuOTU3IEMgNzMuMTQ0IDEzLjUgNDUgMTMuNSA0NSAxMy41IHMgLTI4LjE0NCAwIC0zNS4xNjIgMS44ODEgYyAtMy44NzIgMS4wMzUgLTYuOTIyIDQuMDg1IC03Ljk1NyA3Ljk1NyBDIDAgMzAuMzU2IDAgNDUgMCA0NSBzIDAgMTQuNjQ0IDEuODgxIDIxLjY2MiBjIDEuMDM1IDMuODcyIDQuMDg1IDYuOTIyIDcuOTU3IDcuOTU3IEMgMTYuODU2IDc2LjUgNDUgNzYuNSA0NSA3Ni41IHMgMjguMTQ0IDAgMzUuMTYyIC0xLjg4MSBjIDMuODcyIC0xLjAzNSA2LjkyMiAtNC4wODUgNy45NTcgLTcuOTU3IEMgOTAgNTkuNjQ0IDkwIDQ1IDkwIDQ1IFMgOTAgMzAuMzU2IDg4LjExOSAyMy4zMzggeiIgc3R5bGU9InN0cm9rZTogbm9uZTsgc3Ryb2tlLXdpZHRoOiAxOyBzdHJva2UtZGFzaGFycmF5OiBub25lOyBzdHJva2UtbGluZWNhcDogYnV0dDsgc3Ryb2tlLWxpbmVqb2luOiBtaXRlcjsgc3Ryb2tlLW1pdGVybGltaXQ6IDEwOyBmaWxsOiByZ2IoMjU1LDAsMCk7IGZpbGwtcnVsZTogbm9uemVybzsgb3BhY2l0eTogMTsiIHRyYW5zZm9ybT0iIG1hdHJpeCgxIDAgMCAxIDAgMCkgIiBzdHJva2UtbGluZWNhcD0icm91bmQiIC8+Cgk8cG9seWdvbiBwb2ludHM9IjM2LDU4LjUgNTkuMzgsNDUgMzYsMzEuNSAiIHN0eWxlPSJzdHJva2U6IG5vbmU7IHN0cm9rZS13aWR0aDogMTsgc3Ryb2tlLWRhc2hhcnJheTogbm9uZTsgc3Ryb2tlLWxpbmVjYXA6IGJ1dHQ7IHN0cm9rZS1saW5lam9pbjogbWl0ZXI7IHN0cm9rZS1taXRlcmxpbWl0OiAxMDsgZmlsbDogcmdiKDI1NSwyNTUsMjU1KTsgZmlsbC1ydWxlOiBub256ZXJvOyBvcGFjaXR5OiAxOyIgdHJhbnNmb3JtPSIgIG1hdHJpeCgxIDAgMCAxIDAgMCkgIi8+CjwvZz4KPC9zdmc+
// @grant        none
// @noframes
// @run-at       document-end
// ==/UserScript==

/*
   Notes:
     A fly-out / slide-out panel is located on the right below the channel search box.
     - has a "tab" showing "↓ ↑"
     - move mouse over and then click the relevant buttons.
     Will sort what is listed when either button is clicked.
     Will not sort as you go or as more videos are listed.

    NB for programmer:
    - Don't bother saving the sortKeys to the video elements - when user does another search, YT updates the contents of the existing videos ...
    - yes, z-index 9999 is required due to YT using high numbers somewhere  ;-)
*/


(function() {
    'use strict';

    const IS_DEBUGGING = false;
    const LOG_NAME = 'YT channel sort; ';

    if (IS_DEBUGGING) console.info(LOG_NAME + 'running ...');

    // -- query selectors
    const queryContainer = '#contents.ytd-section-list-renderer';
    const queryMetaData = 'span.inline-metadata-item.style-scope.ytd-video-meta-block';

    // -- for debugging - viewing the sortKeys generated.
    const arraySortKeysData = [];

    function generateSortKeys(uploadedNode, title) {
        // -- fyi, by default, array.sort() is string based.
        // -- uploadedNode = element containing upload info. e.g. 23 days ago
        // -- title = optional text to append to sortKey for third sortKey value.
        // -- return two sort keys - ascending, descending

        const secondsInMinute = 60;
        const secondsInHour = 3600;
        const secondsInDay = 86400;
        const secondsInWeek = 604800;
        const secondsInMonth = 2629800; // Approximately, not exact due to varying month lengths.
        const secondsInYear = 31557600; // Approximately, not exact due to varying leap years.

        // -- uploadedNode pattern: 23 days ago; 3 weeks ago; 4 months ago; 1 year ago;
        let uploadedBits = [];
        if (typeof uploadedNode === 'object') {
            // -- this video has uploaded info
            uploadedBits = uploadedNode.textContent.toLocaleLowerCase().split(' ');
        }
        else {
            // -- this video doesn't have uploaded info
            uploadedBits = uploadedNode.toLocaleLowerCase().split(' ');
        }

        let numUpload = parseInt(uploadedBits[0]);
        let numSeconds = 0;

        if (uploadedBits[0] === 'updated') {
            if (uploadedBits[1] === 'today') {
                numSeconds = secondsInDay;
            }
            if (uploadedBits[1] === 'yesterday') {
                // -- 0.95 because we want these to appear before 1 day entries.
                numSeconds = parseInt(0.95 * secondsInDay);
            }
        }
        else if (isNaN(numUpload)) {
            // -- "Just now"?
            numSeconds = secondsInDay;
        }
        else if (uploadedBits[1] === 'hour' || uploadedBits[1] === 'hours') {
            numSeconds = numUpload * secondsInHour;
        }
        else if (uploadedBits[1] === 'day' || uploadedBits[1] === 'days') {
            numSeconds = numUpload * secondsInDay;
        }
        else if (uploadedBits[1] === 'week' || uploadedBits[1] === 'weeks') {
            numSeconds = numUpload * secondsInWeek;
        }
        else if (uploadedBits[1] === 'month' || uploadedBits[1] === 'months') {
            numSeconds = numUpload * secondsInMonth;
        }
        else if (uploadedBits[1] === 'year' || uploadedBits[1] === 'years') {
            numSeconds = numUpload * secondsInYear;
        }
        else if (uploadedBits[1] === 'no-data') {
            // -- e.g. playlists - don't have uploaded info.
            numSeconds = 100 * secondsInYear;
        }
        else {
            // -- hmm ... unknown unit type, so push down ...
            numSeconds = 100 * secondsInYear;
        }

        // -- decending sortKey ::
        // :: 00 000 000 000 (11)
        let sortKey_desc = ('00000000000' + String(numSeconds)).slice(-11);

        // -- ascending sortKey ::
        // :: 100,000,000,000
        let sortKey_asc = String(100000000000 - numSeconds);

        if (title.length > 0) {
            sortKey_asc += '~' + title;
            sortKey_desc += '~' + title;
        }

        // console.info(LOG_NAME + 'generateSortKeys(); ::', numUpload, numSeconds, uploadedBits, sortKey_asc, sortKey_desc, uploadedNode);
        // -- for debugging purposes ::
        if (IS_DEBUGGING) {
            arraySortKeysData.push({
                "numUpload" : numUpload,
                "numSeconds": numSeconds,
                "sortKeyAsc" : sortKey_asc,
                "sortKeyDesc" : sortKey_desc,
                "uploadedBits" : uploadedBits,
                "node" : uploadedNode
            });
        }

        return [sortKey_asc, sortKey_desc];
    }


    function channelSortSearchResults(sortOrder) {

        const elContainer = document.querySelector(queryContainer);
        if (elContainer === null) {
            return [1, 'Container not found'];
        }

        if (elContainer.childElementCount < 2) {
            return [2, 'Container does not have more than one child ...'];
        }

        // if (IS_DEBUGGING) console.info(LOG_NAME + 'channelSortSearchResults(); sorting ..' + sortOrder);

        // -- get the container's continuation-renderer element
        let elContinuation = elContainer.querySelector('ytd-continuation-item-renderer');

        // -- get the container's children, except for the continuation-renderer ...
        let collectionOfVideos = elContainer.querySelectorAll('ytd-item-section-renderer');

        // -- arrayData item: [sortKey, elVideo];
        let arrayData = [];

        for (let i = 0; i < collectionOfVideos.length; i++) {
            const elVideo = collectionOfVideos[i];

            // -- get the sort data
            let sortKeyAsc;
            let sortKeyDesc
            let metaData = elVideo.querySelectorAll(queryMetaData);
            if (metaData.length > 0) {
                // -- last item of metaData holds the uploaded info.
                [sortKeyAsc, sortKeyDesc] = generateSortKeys(metaData[metaData.length -1], '');
            }
            else {
                // -- video doesn't have uploaded info.
                [sortKeyAsc, sortKeyDesc] = generateSortKeys('1 no-data no-data', '');
            }

            if (sortOrder === 'ascending') {
                arrayData.push([sortKeyAsc, elVideo]);
            }
            else if (sortOrder === 'descending') {
                arrayData.push([sortKeyDesc, elVideo]);
            }
            else {
                return;
            }
        }

        if (IS_DEBUGGING) console.table(arraySortKeysData);

        // if (IS_DEBUGGING) console.info(LOG_NAME + 'channelSortSearchResults(); arrayData - before sort:', sortOrder, arrayData);
        arrayData.sort();
        // if (IS_DEBUGGING) console.info(LOG_NAME + 'channelSortSearchResults(); arrayData - after sort:', arrayData);


        // -- repaints are painfully ... so use another method of redrawing the elContainer's children.
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < arrayData.length; i++) {
            fragment.appendChild(arrayData[i][1]);
        }
        if (elContinuation) {
            fragment.appendChild(elContinuation);
        }
        elContainer.appendChild(fragment);

        return [100, 'videos sorted'];
    }

    function togglePanel(panelID) {
        const elPanel = document.getElementById(panelID);
        if (elPanel === null) {
            return;
        }
        elPanel.classList.toggle('closed');
    }

    function toggleSortButtonsPanel() {

        // console.info(LOG_NAME + 'toggleSortButtonsPanel(); ~ running ~');

        // -- show up on pages in this pattern:
        // :: https://www.youtube.com/@<username>/search?query=<searchTerm>
        // const URL_PATTERN = new RegExp("https://www\\.youtube\\.com/@(\\w+)/search\\?query");
        const URL_PATTERN = new RegExp(/https:\/\/www\.youtube\.com\/@(\w+)\/search/);
        const showPanel = URL_PATTERN.test(window.location.href);

        const panelID = 'ytscPanel';
        const panelStyleID = 'ytscPanelStyles';

        if (IS_DEBUGGING) console.info(LOG_NAME + 'showPanel:', showPanel);

        if (showPanel) {
            // -- locate the element place the panel
            const elContentContainer = document.querySelector('#contentContainer.tp-yt-app-header');
            if (!elContentContainer) {
                if (IS_DEBUGGING) console.info(LOG_NAME + 'toggleSortButtonsPanel(); - cannot find a place for the buttons.');
                return;
            }
            // -- does the panel exists?
            if (document.getElementById(panelID) !== null) {
                if (IS_DEBUGGING) console.info(LOG_NAME + 'toggleSortButtonsPanel(); - found the sort panel.');
                return;
            }

            // -- check if panel's style exists or not ...
            if (!document.head.querySelector(`#${panelStyleID}`)) {
                const css = `
        div.yt-sort-channel-panel {
            position:fixed;
            top:${elContentContainer.clientHeight+15}px;
            right:-205px;
            width:240px;
            margin:1rem;
            /*background-color:var(--ytd-searchbox-background);*/
            background-color: var(--ytd-searchbox-legacy-button-color);
            border:1px solid var(--ytd-searchbox-border-color);
            border-radius: 0.75rem 0 0 0.75rem;
            transition:300ms;
            z-index:9999; /* yeah, YT uses high numbers */

            display:flex;
            align-items:center;
        }

        div.yt-sort-channel-panel > div {
            padding: 1rem 0;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            align-items: center;

            color: var(--yt-spec-text-primary);
        }
        div.yt-sort-channel-panel > div.col-1 {
            flex-basis: 18%;
            font-size:1.5rem;
        }
        div.yt-sort-channel-panel > div.col-2 {
            flex-basis: 82%;
            border-left:1px solid var(--ytd-searchbox-border-color);
        }
        div.yt-sort-channel-panel button {
            width: 150px;
            margin:0.5rem auto;
            font-size: 1.2rem;
            padding: 0.7rem;
            cursor:pointer;
        }
        div.yt-sort-channel-panel:hover {
            right:-10px;
        }
        `;
                const style = document.createElement('style');
                style.id = panelStyleID;
                style.textContent = css;
                document.head.appendChild(style);
            }

            // -- create the panel and associated buttons.
            const elPanel = document.createElement('div');
            elPanel.id = panelID;
            elPanel.classList.add('yt-sort-channel-panel');

            const elCol1 = document.createElement('div');
            elCol1.classList.add('col-1');
            elCol1.textContent = '↓ ↑'; // U+2191 (up) & U+2193 (down)

            const elCol2 = document.createElement('div');
            elCol2.classList.add('col-2');

            const btnSortDesc = document.createElement('button');
            btnSortDesc.textContent = 'Newest';
            btnSortDesc.id = 'YTSC_Desc';

            const btnSortAsc = document.createElement('button');
            btnSortAsc.textContent = 'Oldest';
            btnSortAsc.id = 'YTSC_Asc';

            elCol2.appendChild(btnSortDesc);
            elCol2.appendChild(btnSortAsc);

            elPanel.appendChild(elCol1);
            elPanel.appendChild(elCol2);

            // -- attach the panel to the page ...
            elContentContainer.appendChild(elPanel);

            // -- add click events ..
            btnSortDesc.addEventListener('click', () => {
                event.stopPropagation();
                channelSortSearchResults('descending');
            });
            btnSortAsc.addEventListener('click', () => {
                event.stopPropagation();
                channelSortSearchResults('ascending');
            });

            // -- make the panel shrink/expand
            elPanel.addEventListener('click', () => {
                event.stopPropagation();
                elPanel.classList.toggle('collapsed');
            });

            if (IS_DEBUGGING) console.info(LOG_NAME + 'toggleSortButtonsPanel(); added the channel\s search panel.');
        }

        else {
            // -- remove the panel
            const elPanel = document.getElementById(panelID);
            if (elPanel !== null) {
                elPanel.remove();
            }
        }
    }

    // -- YT doesn't reload the page in typical fashion
    // ... so call this function every X milli-seconds to check if need to create the buttons again ...
    setInterval(toggleSortButtonsPanel, 3500);

    if (IS_DEBUGGING) console.info(LOG_NAME + '... finished');

})();
