// ==UserScript==
// @name         YouTube - sort a channel's search results by upload date
// @namespace    YT-sort-channel-search-results
// @version      0.7
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
     - move mouse over the tab and then click the relevant buttons / options.
     Script will re-sort what is listed when a button is clicked.
     Can set additional option to prioritise keyword match in video's title and/or description when re-sorting.
     Will not automatically sort as you scroll, nor when more videos are dynamically added.

    NB for programmer:
    - Don't bother saving the sortKeys to the video elements ...
    - .. when user does another search, YT updates the contents of the existing videos ...
*/


(function () {
    'use strict';

    const IS_DEBUGGING = false;
    const LOG_NAME = 'YT channel sort; ';

    if (IS_DEBUGGING) console.info(LOG_NAME + 'running ...');

    // -- for debugging - viewing the sortKeys generated.
    let arrayDebugSortData = [];

    function generateSortKey(uploadedInfo, prioritiseKeywordsMatch = false, sortOrder = 'descending') {
        // -- fyi, by default, array.sort() is string based.
        // -- uploadedInfo = uploaded info text. e.g. 23 days ago
        // -- prioritiseKeywordsMatch = flag indicating if this video entry is to be ranked higher or lower.
        // :: return two sort keys - ascending, descending

        // -- number of seconds in time block
        const timeLookup = {
            'minute': 60,
            'minutes': 60,
            'hour': 3600,
            'hours': 3600,
            'day': 86400,
            'days': 86400,
            'week': 604800,
            'weeks': 604800,
            'month': 2592000, // (approximate)
            'months': 2592000,
            'year': 31536000, // (approximate)
            'years': 31536000,
            'no-data': 3153600000, // (e.g. playlists and unknown time units)
        };

        const uploadedInfoParts = uploadedInfo.toLocaleLowerCase().split(' ');
        const numUpload = parseInt(uploadedInfoParts[0], 10);
        let numSeconds = 0;

        if (!isNaN(numUpload)) {
            // -- uploadedInfo pattern: 23 days ago; 3 weeks ago; 4 months ago; 1 year ago;
            if (uploadedInfoParts[1] in timeLookup) {
                // -- lookup known unit types.
                numSeconds = numUpload * timeLookup[uploadedInfoParts[1]];
            }
            else {
                // -- Unknown unit type, so use "no-data"'s values.
                numSeconds = numUpload * timeLookup['no-data'];
            }
        }
        else {
            // -- uploadedInfo pattern: Updated today; Updated 6 days ago; Premieres <future>; Streamed 3 weeks ago;
            if (uploadedInfoParts[0] === 'updated') {
                if (uploadedInfoParts[1] === 'today') {
                    // -- when today? - make it appear after 23.5 hours ago.
                    numSeconds = parseInt(23.5 * timeLookup['hour'], 10)
                }
                else if (uploadedInfoParts[1] === 'yesterday') {
                    // -- when yesterday? - make it appear just before 24 hours ago
                    // ... so it appears before the 1 day ago videos.
                    numSeconds = parseInt(23.75 * timeLookup['hour'], 10);
                }
                else {
                    // -- updated x days ago
                    const numUpdated = parseInt(uploadedInfoParts[1], 10);
                    if (!isNaN(numUpdated)) {
                        numSeconds = numUpdated * timeLookup[uploadedInfoParts[2]];
                    }
                }
            }
            else if (uploadedInfoParts[0] === 'streamed') {
                // -- "Streamed 2 days ago"
                numUpload = parseInt(uploadedInfoParts[1], 10);
                numSeconds = numUpload * timeLookup[uploadedInfoParts[2]];
            }
            else if (uploadedInfoParts[0] === 'premieres') {
                // -- Premieres <future: dd/mm/yyyy, hh:mm>); 
                // -- set to 30 to keep @ top for newest.
                numSeconds = 30;
            }
            else {
                // -- Unknown uploaded info text.
                numSeconds = timeLookup['minute'];
            }
        }

        let sortKey = (prioritiseKeywordsMatch ? '0' : '9');
        const padZeros = '0000000000'; // 10 x 0
        const padZerosLen = padZeros.length;
        const bigNum = Number(1 + padZeros);
        if (sortOrder === 'descending') {
            // e.g. (without prioritiseKeywordsMatch)
            // :: 0000025200 = 7 hours
            // :: 0000345600 = 4 days
            // :: 0007776000 = 3 months
            // :: 0946080000 = 30 years
            // :: 3153600000 = no data / unknown
            sortKey += (padZeros + String(numSeconds)).slice(-padZerosLen);
        }
        else {
            // e.g. (without prioritiseKeywordsMatch)
            // :: 16846400000 = no data / unknown
            // :: 19992224000 = 3 months
            // :: 19999654400 = 4 days
            // :: 19999974800 = 7 hours
            sortKey += String(bigNum - numSeconds);
        }

        // -- for debugging purposes ::
        // -- printed by calling function (laid out in a table format.)
        if (IS_DEBUGGING) {
            arrayDebugSortData.push({
                "numUpload": numUpload,
                "numSeconds": numSeconds,
                "prioritise": prioritiseKeywordsMatch,
                "sortOrder": sortOrder,
                "sortKey": sortKey,
                "uploadedInfoParts": uploadedInfoParts,
                "uploadedInfo": uploadedInfo
            });
        }

        return sortKey;
    }

    function findSearchKeywordMatch(element, searchKeyword) {
        const text = element.textContent.split('\n').join(' ').trim().toLocaleLowerCase();
        return text.includes(searchKeyword);
    }

    function channelSortSearchResults(sortOrder, findKeywordInTitle = false, findKeywordInDescription = false) {

        const elContainer = document.querySelector('#contents.ytd-section-list-renderer');
        if (elContainer === null) {
            return [1, 'Container not found'];
        }

        if (elContainer.childElementCount < 2) {
            return [2, 'Container does not have more than one child ...'];
        }

        // if (IS_DEBUGGING) console.info(LOG_NAME + 'channelSortSearchResults(); sorting ..' + sortOrder);

        // -- get the container's continuation-renderer element
        const elContinuation = elContainer.querySelector('ytd-continuation-item-renderer');

        // -- get the container's children, except for the continuation-renderer ...
        const collectionOfVideos = elContainer.querySelectorAll('ytd-item-section-renderer');

        // -- arrayData item: [sortKey, elVideo];
        let arrayData = [];

        let searchKeyword
        if (findKeywordInTitle || findKeywordInDescription) {
            // -- get the search keyword(s) the user used for searching.
            searchKeyword = document.querySelector('input.tp-yt-paper-input').value.toLocaleLowerCase();
        }

        if (IS_DEBUGGING) {
            arrayDebugSortData = [];
        }

        for (let i = 0; i < collectionOfVideos.length; i++) {
            const elVideo = collectionOfVideos[i];

            const isStandaloneVideo = (elVideo.querySelector('ytd-playlist-renderer') === null);
            let foundKeywordInVideoTD = false;

            if (findKeywordInTitle || findKeywordInDescription) {
                const arrVideoTitles = elVideo.querySelectorAll('#video-title');
                const elVideoDescription = elVideo.querySelector('#description-text');

                if (findKeywordInTitle) {
                    foundKeywordInVideoTD = findSearchKeywordMatch(arrVideoTitles[0], searchKeyword);
                }
                if (foundKeywordInVideoTD === false && findKeywordInDescription) {
                    if (isStandaloneVideo) {
                        foundKeywordInVideoTD = findSearchKeywordMatch(elVideoDescription, searchKeyword);
                    }
                    else {
                        // -- playlist
                        // -- already checked the first #video-title, so, scan the rest.
                        for (let i = 1; i < arrVideoTitles.length; i++) {
                            if (findSearchKeywordMatch(arrVideoTitles[i], searchKeyword)) {
                                foundKeywordInVideoTD = true;
                                break;
                            }
                        }
                    }
                }
            }

            // -- nb: playlists don't have uploaded info.
            let uploadedInfo = '1 no-data no-data';
            if (isStandaloneVideo) {
                const metaData = elVideo.querySelectorAll('span.inline-metadata-item.style-scope.ytd-video-meta-block');
                // -- last item of metaData holds the uploaded info.
                uploadedInfo = metaData[metaData.length - 1].textContent;
            }

            // -- add generated sort key and video to array ...
            arrayData.push([generateSortKey(uploadedInfo, foundKeywordInVideoTD, sortOrder), elVideo]);
        }

        if (IS_DEBUGGING) console.table(arrayDebugSortData);

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

    function drawPanelForSortButtons() {

        // console.info(LOG_NAME + 'drawPanelForSortButtons(); ~ running ~');

        // -- show up on pages having the following URL pattern:
        // :: https://www.youtube.com/@<channel-name>/search?query=<searchTerm>

        if (window.location.hostname !== "www.youtube.com") {
            return;
        }

        let showPanel = false;
        if (window.location.pathname.startsWith('/@')) {
            let pathnameBits = window.location.pathname.split('/');
            if (pathnameBits.length > 2) {
                showPanel = (pathnameBits[2] === 'search')
            }
        }

        const panelID = 'ytscPanel';
        const panelStyleID = 'ytscPanelStyles';

        if (IS_DEBUGGING) console.info(LOG_NAME + 'showPanel:', showPanel);
        // console.info(LOG_NAME + 'showPanel:', showPanel);

        if (showPanel) {
            // -- locate the element place the panel
            const elContentContainer = document.querySelector('#contentContainer.tp-yt-app-header');
            if (!elContentContainer) {
                if (IS_DEBUGGING) console.info(LOG_NAME + 'drawPanelForSortButtons(); - cannot find a place for the buttons.');
                return;
            }
            // -- does the panel exists?
            if (document.getElementById(panelID) !== null) {
                if (IS_DEBUGGING) console.info(LOG_NAME + 'drawPanelForSortButtons(); - found the sort panel.');
                return;
            }

            // -- check if panel's style exists or not ...
            if (!document.head.querySelector(`#${panelStyleID}`)) {
                const css = `
                    div.yt-sort-channel-panel {
                        position:fixed;
                        top:${elContentContainer.clientHeight + 15}px;
                        right:-205px;
                        width:240px;
                        margin:1rem;
                        font-size: 1.2rem;
                        background-color: var(--ytd-searchbox-legacy-button-color);
                        border:1px solid var(--ytd-searchbox-border-color);
                        border-radius: 0.75rem 0 0 0.75rem;
                        transition:300ms;
                        z-index:9999; /* yeah, YT uses high numbers */

                        display:flex;
                        align-items:center;
                        box-sizing: border-box;
                    }
                    div.yt-sort-channel-panel * {
                        font-size: inherit;
                    }
                    div.yt-sort-channel-panel > div {
                        padding: 1rem 0;
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
                        padding: 0.7rem;
                        cursor:pointer;
                    }
                    div.yt-sort-channel-panel > div.col-2 div {
                        margin:0.5rem auto;
                        text-align: left;
                    }
                    div.yt-sort-channel-panel label {
                        display: block;
                        width: 150px;
                        padding: 0.35rem;
                    }
                    div.yt-sort-channel-panel label input {
                        margin-right: 0.65rem;
                        margin-left: 0;
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

            const divHasKeywords = document.createElement('div');
            const labelKeywordsIn = document.createElement('label');
            labelKeywordsIn.textContent = 'Prioritise videos having keyword(s) in:';
            divHasKeywords.appendChild(labelKeywordsIn);

            const labelTitleRelevance = document.createElement('label');
            labelTitleRelevance.setAttribute('for', 'YTSC_RelevanceTitle');

            const cbTitleRelevance = document.createElement('input');
            cbTitleRelevance.type = 'checkbox';
            cbTitleRelevance.id = 'YTSC_RelevanceTitle';

            labelTitleRelevance.appendChild(cbTitleRelevance);
            labelTitleRelevance.appendChild(document.createTextNode('Title'));

            const labelDescriptionRelevance = document.createElement('label');
            labelDescriptionRelevance.setAttribute('for', 'YTSC_RelevanceDescription');

            const cbDescriptionRelevance = document.createElement('input');
            cbDescriptionRelevance.type = 'checkbox';
            cbDescriptionRelevance.id = 'YTSC_RelevanceDescription';

            labelDescriptionRelevance.appendChild(cbDescriptionRelevance);
            labelDescriptionRelevance.appendChild(document.createTextNode('Description'));

            divHasKeywords.appendChild(labelTitleRelevance);
            divHasKeywords.appendChild(labelDescriptionRelevance);

            elCol2.appendChild(btnSortDesc);
            elCol2.appendChild(btnSortAsc);
            elCol2.appendChild(divHasKeywords);

            elPanel.appendChild(elCol1);
            elPanel.appendChild(elCol2);

            // -- attach the panel to the page ...
            elContentContainer.appendChild(elPanel);

            // -- add click events ..
            btnSortDesc.addEventListener('click', (event) => {
                // -- newest
                event.stopPropagation();
                channelSortSearchResults('descending', cbTitleRelevance.checked, cbDescriptionRelevance.checked);
            });
            btnSortAsc.addEventListener('click', (event) => {
                // -- oldest
                event.stopPropagation();
                channelSortSearchResults('ascending', cbTitleRelevance.checked, cbDescriptionRelevance.checked);
            });

            if (IS_DEBUGGING) console.info(LOG_NAME + 'drawPanelForSortButtons(); added the channel\s search panel.');
        }

        else {
            // -- remove the panel
            const elPanel = document.getElementById(panelID);
            if (elPanel !== null) {
                elPanel.remove();
            }
        }
    }

    // -- YT doesn't reload the page in typical fashion,
    // -- so run mutation observer ... 
    function handleMutations(mutationsList, observer) {
        // -- slow down the number of calls to main function.
        const addedDivMutations = mutationsList.some((mutation) => Array.from(mutation.addedNodes).some((node) => node instanceof HTMLDivElement));
        if (addedDivMutations) {
            drawPanelForSortButtons();
        }
    }
    const observer = new MutationObserver(handleMutations);
    observer.observe(document.body, { childList: true, subtree: true });

    if (IS_DEBUGGING) console.info(LOG_NAME + '... finished');

})();
