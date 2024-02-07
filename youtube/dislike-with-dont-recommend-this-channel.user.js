// ==UserScript==
// @name         YouTube Shorts - Dislike with Don't recommend this channel
// @namespace    YouTubeShortsDislikeAutoDontRecommendChannel
// @version      0.1
// @description  Clicking on YT's Dislike button will trigger "Don't recommend this channel"
// @author       zblue
// @match        https://www.youtube.com/shorts/*
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+Cgo8ZGVmcz4KPC9kZWZzPgo8ZyBzdHlsZT0ic3Ryb2tlOiBub25lOyBzdHJva2Utd2lkdGg6IDA7IHN0cm9rZS1kYXNoYXJyYXk6IG5vbmU7IHN0cm9rZS1saW5lY2FwOiBidXR0OyBzdHJva2UtbGluZWpvaW46IG1pdGVyOyBzdHJva2UtbWl0ZXJsaW1pdDogMTA7IGZpbGw6IG5vbmU7IGZpbGwtcnVsZTogbm9uemVybzsgb3BhY2l0eTogMTsiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEuNDA2NTkzNDA2NTkzNDAxNiAxLjQwNjU5MzQwNjU5MzQwMTYpIHNjYWxlKDIuODEgMi44MSkiID4KCTxwYXRoIGQ9Ik0gODguMTE5IDIzLjMzOCBjIC0xLjAzNSAtMy44NzIgLTQuMDg1IC02LjkyMiAtNy45NTcgLTcuOTU3IEMgNzMuMTQ0IDEzLjUgNDUgMTMuNSA0NSAxMy41IHMgLTI4LjE0NCAwIC0zNS4xNjIgMS44ODEgYyAtMy44NzIgMS4wMzUgLTYuOTIyIDQuMDg1IC03Ljk1NyA3Ljk1NyBDIDAgMzAuMzU2IDAgNDUgMCA0NSBzIDAgMTQuNjQ0IDEuODgxIDIxLjY2MiBjIDEuMDM1IDMuODcyIDQuMDg1IDYuOTIyIDcuOTU3IDcuOTU3IEMgMTYuODU2IDc2LjUgNDUgNzYuNSA0NSA3Ni41IHMgMjguMTQ0IDAgMzUuMTYyIC0xLjg4MSBjIDMuODcyIC0xLjAzNSA2LjkyMiAtNC4wODUgNy45NTcgLTcuOTU3IEMgOTAgNTkuNjQ0IDkwIDQ1IDkwIDQ1IFMgOTAgMzAuMzU2IDg4LjExOSAyMy4zMzggeiIgc3R5bGU9InN0cm9rZTogbm9uZTsgc3Ryb2tlLXdpZHRoOiAxOyBzdHJva2UtZGFzaGFycmF5OiBub25lOyBzdHJva2UtbGluZWNhcDogYnV0dDsgc3Ryb2tlLWxpbmVqb2luOiBtaXRlcjsgc3Ryb2tlLW1pdGVybGltaXQ6IDEwOyBmaWxsOiByZ2IoMjU1LDAsMCk7IGZpbGwtcnVsZTogbm9uemVybzsgb3BhY2l0eTogMTsiIHRyYW5zZm9ybT0iIG1hdHJpeCgxIDAgMCAxIDAgMCkgIiBzdHJva2UtbGluZWNhcD0icm91bmQiIC8+Cgk8cG9seWdvbiBwb2ludHM9IjM2LDU4LjUgNTkuMzgsNDUgMzYsMzEuNSAiIHN0eWxlPSJzdHJva2U6IG5vbmU7IHN0cm9rZS13aWR0aDogMTsgc3Ryb2tlLWRhc2hhcnJheTogbm9uZTsgc3Ryb2tlLWxpbmVjYXA6IGJ1dHQ7IHN0cm9rZS1saW5lam9pbjogbWl0ZXI7IHN0cm9rZS1taXRlcmxpbWl0OiAxMDsgZmlsbDogcmdiKDI1NSwyNTUsMjU1KTsgZmlsbC1ydWxlOiBub256ZXJvOyBvcGFjaXR5OiAxOyIgdHJhbnNmb3JtPSIgIG1hdHJpeCgxIDAgMCAxIDAgMCkgIi8+CjwvZz4KPC9zdmc+
// @grant        none
// @noframes
// @run-at       document-body
// ==/UserScript==


(function () {
    'use strict';

    // ** START OF USER MODIFICATIONS ** //

    // -- For non-English users, translate the following into your language.

    // -- the Action with vertical three dots that denotes more actions - use the aria-label's value.
    const ARIA_LABEL_FOR_MORE_ACTIONS = "More actions"

    // -- the "Don't recommend this channel" text in the More Actions menu.
    const DONT_RECOMMEND_THIS_CHANNEL_TEXT = "Don't recommend this channel";

    // ** END OF USER MODIFICATIONS ** //



    const log = 'Do not recommend channel ';

    const ATT_FLAGGED = 'dadrtc';

    function dontRecommendChannel(ev) {

        // -- dislike button clicked
        const elDislike = ev.target;

        // -- which state is the dislike button in? (if not "filled", then stop).
        const elDislikeButton = elDislike.closest('button');
        // -- using .classList.contains(...) test condition is a bit off/laggy.
        // -- instead, take a snapshot of classList and then test.
        const dbClasses = Array.from(elDislikeButton.classList);
        if (dbClasses.indexOf('yt-spec-button-shape-next--filled') < 0) {
            console.info(log + 'elDislikeButton - you have un-disliked the video');
            return;
        }

        // -- get the container holding the list of actions
        const elContainer = elDislike.closest('.action-container');
        if (!elContainer) {
            return;
        }
        // -- locate the More Actions button
        const elMoreActions = elContainer.querySelector(`[aria-label="${ARIA_LABEL_FOR_MORE_ACTIONS}"]`);
        if (!elMoreActions) {
            return;
        }

        // -- debugging:
        // const elPopupContainerX = document.querySelector('ytd-popup-container');
        // console.info(log + 'dontRecommendChannel(); \nelDislike:', elDislike, '\nelContainer:', elContainer, '\nelMoreActions:', elMoreActions, '\nelPopupContainerX:', elPopupContainerX);

        // -- trigger the More Actions
        elMoreActions.click();

        // -- wait for More Actions popup to be come available (it might be slow first time it is called)
        function waitForMoreActions() {
            const popupContainerItems = document.querySelectorAll('ytd-popup-container tp-yt-iron-dropdown ytd-menu-service-item-renderer yt-formatted-string');
            if (popupContainerItems.length > 3) {
                // -- delay the call to processMoreActions() by a few ms to give YT to complete the listing of actions.
                setTimeout(processMoreActions, 250);
            }
            else {
                setTimeout(waitForMoreActions, 250);
            }
        }
        waitForMoreActions();


        function processMoreActions() {
            // -- scan for the "Don't recommend this channel" action ...

            const collectionOfMoreActionsFormattedText = document.querySelectorAll('ytd-popup-container tp-yt-iron-dropdown ytd-menu-service-item-renderer yt-formatted-string');
            // console.info(log + 'processMoreActions(); collectionOfMoreActionsFormattedText:', collectionOfMoreActionsFormattedText);

            for (const menuActionFormattedText of collectionOfMoreActionsFormattedText) {
                  //console.info(log + 'processMoreActions(); \nmenuActionFormattedText: ', menuActionFormattedText,'\nmenuActionFormattedText.innerText:', menuActionFormattedText.innerText);
                if (menuActionFormattedText.innerText === DONT_RECOMMEND_THIS_CHANNEL_TEXT) {
                    const elMenuService = menuActionFormattedText.closest('ytd-menu-service-item-renderer');
                    elMenuService.click();
                    //console.info(log + 'processMoreActions(); menuActionFormattedText --->:', menuActionFormattedText, menuActionFormattedText.innerText, elMenuService);
                    break;
                }
            }
        }
    }

    function listenToDislikeButtons() {
        const dislikeButtons = document.querySelectorAll(`[id="dislike-button"]:not(${ATT_FLAGGED})`);
        for (const btnDislike of dislikeButtons) {
            btnDislike.addEventListener('click', dontRecommendChannel);
        }
        setTimeout(listenToDislikeButtons, 500);
    }

    listenToDislikeButtons();

})();
