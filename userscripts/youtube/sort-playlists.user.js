// ==UserScript==
// @name         YouTube - sort Playlists
// @namespace    YouTubeSortPlaylists
// @version      0.5
// @description  Sort the playlists in YT's sidebar. Add top/bottom buttons for scrolling through playlists.
// @author       You
// @match        https://www.youtube.com/*
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+Cgo8ZGVmcz4KPC9kZWZzPgo8ZyBzdHlsZT0ic3Ryb2tlOiBub25lOyBzdHJva2Utd2lkdGg6IDA7IHN0cm9rZS1kYXNoYXJyYXk6IG5vbmU7IHN0cm9rZS1saW5lY2FwOiBidXR0OyBzdHJva2UtbGluZWpvaW46IG1pdGVyOyBzdHJva2UtbWl0ZXJsaW1pdDogMTA7IGZpbGw6IG5vbmU7IGZpbGwtcnVsZTogbm9uemVybzsgb3BhY2l0eTogMTsiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEuNDA2NTkzNDA2NTkzNDAxNiAxLjQwNjU5MzQwNjU5MzQwMTYpIHNjYWxlKDIuODEgMi44MSkiID4KCTxwYXRoIGQ9Ik0gODguMTE5IDIzLjMzOCBjIC0xLjAzNSAtMy44NzIgLTQuMDg1IC02LjkyMiAtNy45NTcgLTcuOTU3IEMgNzMuMTQ0IDEzLjUgNDUgMTMuNSA0NSAxMy41IHMgLTI4LjE0NCAwIC0zNS4xNjIgMS44ODEgYyAtMy44NzIgMS4wMzUgLTYuOTIyIDQuMDg1IC03Ljk1NyA3Ljk1NyBDIDAgMzAuMzU2IDAgNDUgMCA0NSBzIDAgMTQuNjQ0IDEuODgxIDIxLjY2MiBjIDEuMDM1IDMuODcyIDQuMDg1IDYuOTIyIDcuOTU3IDcuOTU3IEMgMTYuODU2IDc2LjUgNDUgNzYuNSA0NSA3Ni41IHMgMjguMTQ0IDAgMzUuMTYyIC0xLjg4MSBjIDMuODcyIC0xLjAzNSA2LjkyMiAtNC4wODUgNy45NTcgLTcuOTU3IEMgOTAgNTkuNjQ0IDkwIDQ1IDkwIDQ1IFMgOTAgMzAuMzU2IDg4LjExOSAyMy4zMzggeiIgc3R5bGU9InN0cm9rZTogbm9uZTsgc3Ryb2tlLXdpZHRoOiAxOyBzdHJva2UtZGFzaGFycmF5OiBub25lOyBzdHJva2UtbGluZWNhcDogYnV0dDsgc3Ryb2tlLWxpbmVqb2luOiBtaXRlcjsgc3Ryb2tlLW1pdGVybGltaXQ6IDEwOyBmaWxsOiByZ2IoMjU1LDAsMCk7IGZpbGwtcnVsZTogbm9uemVybzsgb3BhY2l0eTogMTsiIHRyYW5zZm9ybT0iIG1hdHJpeCgxIDAgMCAxIDAgMCkgIiBzdHJva2UtbGluZWNhcD0icm91bmQiIC8+Cgk8cG9seWdvbiBwb2ludHM9IjM2LDU4LjUgNTkuMzgsNDUgMzYsMzEuNSAiIHN0eWxlPSJzdHJva2U6IG5vbmU7IHN0cm9rZS13aWR0aDogMTsgc3Ryb2tlLWRhc2hhcnJheTogbm9uZTsgc3Ryb2tlLWxpbmVjYXA6IGJ1dHQ7IHN0cm9rZS1saW5lam9pbjogbWl0ZXI7IHN0cm9rZS1taXRlcmxpbWl0OiAxMDsgZmlsbDogcmdiKDI1NSwyNTUsMjU1KTsgZmlsbC1ydWxlOiBub256ZXJvOyBvcGFjaXR5OiAxOyIgdHJhbnNmb3JtPSIgIG1hdHJpeCgxIDAgMCAxIDAgMCkgIi8+CjwvZz4KPC9zdmc+
// @grant        none
// @noframes
// @run-at       document-body
// ==/UserScript==

(function () {
    'use strict';

    // -- nb: script will stop once the playlists listing is sorted.
    // -- does not stay alive and watch for new playlists. YT is funny about that.

    // --> user options ::

    // -- for printing to console log
    const IS_DEBUGGING = false;
    // -- add playlists scrolling buttons for Top and Bottom
    const ADD_SCROLLING_BUTTONS = true;

    // <-- user options ::


    // -- for console logging - source of log entries
    const LOG_NAME = 'YouTube - sort Playlists; ';
    // -- flag to indicate we're done with sorting.
    const ATT_SORTED = 'ytsp';
    // -- indicate if scroll buttons have been added (run once during script execution).
    let scrollButtonsAdded = false;


    function sortPlaylists() {

        // -- automatically open the 'show more..' item to display the playlists
        // -- grab the listing of playlists
        // -- and then sort them
        // -- and then update the HTML
        // -- return an array - code and message
        // --   0 = not successful for some reason
        // --  100 = success

        if (IS_DEBUGGING) {
            console.info(LOG_NAME + 'Starting...');
        }

        // -- check for "Show more" element - should only have one
        const showMoreLinkNodes = document.querySelectorAll('a[id="endpoint"][title="Show more"]');
        if (showMoreLinkNodes.length != 1) {
            return [0, (showMoreLinkNodes.length === 0) ? '"Show more" link not found' : 'Too many "Show more" links found'];
        }
        if (showMoreLinkNodes[0].hasAttribute(ATT_SORTED)) {
            return [100, 'Sorted'];
        }

        // -- get "Show more" element's container/wrapper.
        // -- used for activating the display of all playlists
        const elShowMoreContainer = showMoreLinkNodes[0].parentNode;
        if (elShowMoreContainer.hasAttribute(ATT_SORTED) === false) {
            // -- mimic the "Show More" click event to expose the list of playlists.
            const clickEvent = new MouseEvent('click', {view: window, bubbles: true, cancelable: true});
            // -- make it show the playlists
            elShowMoreContainer.dispatchEvent(clickEvent);
            // -- remember that the click event has been set.
            elShowMoreContainer.setAttribute(ATT_SORTED, '1');
        }

        // -- elShowMoreContainer has a sibling holding the playlists (except for newly added playlist)
        const elExpandedContainer = elShowMoreContainer.parentElement.querySelector('#expanded');
        if (!elExpandedContainer) {
            return [0, '#expanded container not found'];
        }

        // -- #expandable-items has the playlists folders
        const elExpandableItemsContainer = elExpandedContainer.querySelector('#expandable-items')
        if (!elExpandableItemsContainer) {
            return [0, '#expandable-items container not found'];
        }

        // -- grab all playlists (except newly added)
        let elementsPlaylists = elExpandableItemsContainer.children;
        if (IS_DEBUGGING) {
            console.info(LOG_NAME + 'playlists count:', elementsPlaylists.length);
        }
        if (elementsPlaylists.length === 0) {
            return [100, 'No playlists found'];
        }
        if (elementsPlaylists.length === 1) {
            return [100, 'One playlist found. Already sorted ...'];
        }

        // -- main playlists
        // -- nb: Keep "Liked videos" at the top of list.
        let arrayPlaylists = [];
        for (let i = 0; i < elementsPlaylists.length; i++) {
            const elPlaylist = elementsPlaylists[i];
            const elLink = elPlaylist.querySelector('a');
            if (elLink !== null) {
                // let title = elLink.title.normalize('NFKC').toLocaleLowerCase().trim();
                let title = elLink.title.toLocaleLowerCase().trim();
                if (IS_DEBUGGING) {
                    console.info(LOG_NAME + 'unsorted playlist (query 1), #', i, title);
                }
                if (title === 'liked videos') {
                    // -- these prefixed spaces are special space characters (sorting will keep them at the top of the list)
                    title = '          ' + title;
                }
                arrayPlaylists.push([title, elPlaylist]);
            }
        }

        // -- sort the playlists.
        arrayPlaylists.sort();
        if (IS_DEBUGGING) {
            for (let i = 0; i < arrayPlaylists.length; i++) {
                console.info(LOG_NAME + 'sorted playlists, #', i, arrayPlaylists[i][0])
            }
        }

        // -- update the HTML ... use the fragment method (reduces DOM manipulation)
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < arrayPlaylists.length; i++) {
            fragment.appendChild(arrayPlaylists[i][1]);
        }
        elExpandableItemsContainer.appendChild(fragment);

        // -- tell "Show more" link that the playlists are sorted
        showMoreLinkNodes[0].setAttribute(ATT_SORTED, '1');

        // -- add "Top" and "Bottom" buttons
        if (ADD_SCROLLING_BUTTONS === true && scrollButtonsAdded === false ) {
            addScrollingButtonsInLeftPanel();
        }

        // -- tell the caller playlists is sorted (used for stopping the code)
        return [100, 'Sorted'];
    }

    function addScrollingButtonsInLeftPanel() {
        // -- scroll to bottom / top in the left side-bar panel
        const sideBarSections = document.querySelector('[id="guide-inner-content"] [id="sections"]');
        if (!sideBarSections) {
            return [0, 'Sidebar not found'];
        }
        // -- grab the element with the "overflow" property.
        const scrollingContainer = sideBarSections.closest('[id="guide-inner-content"]');

        // -- buttons ...
        const containerButtons = document.createElement('div');
        containerButtons.id = "ScrollingButtons";

        // -- button: scroll to bottom
        const btnScrollToBottom = document.createElement('button');
        btnScrollToBottom.textContent = '▼'; // '&#x25BC;';
        btnScrollToBottom.id = 'BTN_scrollToBottom';

        // -- button : top
        const btnScrollToTop = document.createElement('button');
        btnScrollToTop.textContent = '▲'; // '&#x25B2;';
        btnScrollToTop.id = 'BTN_scrollToTop';

        // -- scrolling buttons to be placed beneath the #header element.
        containerButtons.appendChild(btnScrollToTop);
        containerButtons.appendChild(btnScrollToBottom);
        const sidePanel = sideBarSections.closest('#guide-content');
        const header = sidePanel.querySelector('#header');
        header.insertAdjacentElement('afterend', containerButtons);

        // -- add click events ..
        btnScrollToBottom.addEventListener('click', () => {
            scrollingContainer.scrollTo({
                top: scrollingContainer.scrollHeight,
                behavior: 'smooth'
            });
        });
        btnScrollToTop.addEventListener('click', () => {
            scrollingContainer.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        const css = `
        #ScrollingButtons {
          text-align: center;
          padding: 0.25rem 0;
        }
        #ScrollingButtons button {
            width: 25%;
          margin: 0 1rem;
        }
        `;
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);

        scrollButtonsAdded = true;

        return [100, 'Scrolling buttons added'];
    }


    function runSideBarMO() {
        // -- watch the sidebar menu node for changes (via MutationObserver)
        // -- called by runBodyMO() - when the sidebar menu node is available.
        // -- once the playlists are sorted, quit.

        // -- do the initial sort (the playlists items could be there now)
        const results = sortPlaylists();
        if (IS_DEBUGGING) {
            console.info(LOG_NAME + 'first time calling sortPlaylists():', results);
        }
        if (results[0] === 100) {
            // -- job done, quit. No need for further observations ...
            if (IS_DEBUGGING) {
                console.info(LOG_NAME, 'Stopping!');
            }
            return;
        }

        const observer = new MutationObserver((mutationsList, observer) => {
            // -- iterate over the mutations
            for (const mutation of mutationsList) {
                if ((mutation.type === 'childList') && (mutation.addedNodes.length > 0)) {
                    // -- something has been added ...
                    let mnode = mutation.addedNodes[0];
                    const results = sortPlaylists();
                    if (IS_DEBUGGING) {
                        console.info(LOG_NAME + 'sortPlaylists():', results);
                    }
                    if (results[0] === 100) {
                        // -- job done, quit. No need for further observations ...
                        if (IS_DEBUGGING) {
                            console.info(LOG_NAME, 'Stopping!');
                        }
                        observer.disconnect();
                        return;
                    }
                }
            }
        });

        // const nodeToObserve = document.querySelector('ytd-guide-collapsible-entry-renderer');
        const nodeToObserve = document.querySelector('#section-items');
        // if (IS_DEBUGGING) {
        //     console.info(LOG_NAME + 'nodeToObserve:', nodeToObserve);
        // }
        observer.observe(nodeToObserve, {childList: true, subtree: true, attributes: false});
    }


    let counter = 0;
    function runBodyMO() {
        // -- observe the BODY and when the sidebar's element is available, switch to observing that node.
        // -- (for reducing this script's cpu footprint).
        const elBody = document.body;

        if (elBody) {
            // -- configuration for the MutationObserver
            const observerConfig = {childList: true, subtree: true, attributes: false};

            // -- create a MutationObserver instance
            const observer = new MutationObserver((mutationsList, observer) => {
                for (const mutation of mutationsList) {
                    // -- check if the sidebar's element has been added
                    const addedNodes = mutation.addedNodes;
                    for (const addedNode of addedNodes) {
                        if (addedNode.nodeName === 'YTD-GUIDE-COLLAPSIBLE-ENTRY-RENDERER') {
                            runSideBarMO();

                            // -- stop observing further mutations on the BODY
                            observer.disconnect();
                            return;
                        }
                    }
                }
            });

            // -- start observing mutations on the BODY element
            observer.observe(elBody, observerConfig);

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
