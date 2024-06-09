// ==UserScript==
// @name         FB - Clean my feeds (mobile) (1.01j)
// @description  Hide Sponsored, Paid partnership, Suggestions and Nuisance posts in FB's News Feed + Groups Feed
// @namespace    https://greasyfork.org/users/812551
// @supportURL   https://github.com/zbluebugz/facebook-clean-my-feeds/issues
// @version      1.01j
// @author       zbluebugz (https://github.com/zbluebugz/)
// @match        https://m.facebook.com/*
// @noframes
// @grant        GM.info
// @grant        unsafeWindow
// @license      MIT; https://opensource.org/licenses/MIT
// @run-at       document-start
// @grant        GM_addStyle
// ==/UserScript==

/*
    Description:
        - Does the clean up in the News Feed and Groups Feed.
        - Hides Sponsored, Paid partnership, Follow, Suggested, Suggested pages and Nuisance pages (aka wanted posts)


    v1.01 :: June 2024
        - First release
        - News Feed - Sponsored, Suggested, Paid-partnership, Follow, Suggested pages, Nuisances pages
        - Groups Feed - ...


    Additional Notes:

    Works for the following languages:
        'en', // English
        'pt', // Português (Portugal and Brazil)
        'de', // Deutsch (Germany)
        'fr', // Français (France)
        'es', // Espanol (Spain)
        'cs', // Čeština (Czechia)
        'vi', // Tiếng Việt (Vietnam)
        'it', // Italino (Italy)
        'lv', // Latviešu (Latvia)
        'pl', // Polski (Poland)
        'nl', // Nederlands (Netherlands)
        'he', // עִברִית (Hebrew)
        'ar', // العربية (Arabic)
        'id', // Bahasa Indonesia (Indonesia)
        'zh-Hans', // Chinese (Simplified)
        'zh-Hant', // Chinese (Traditional)
        'ja', // Japanese (Japan)
        'fi', // Suomi - Finnish (Finland)
        'tr', // Türkçe (Turkey)
        'el', // Ελληνικά (Greece)
        'ru', // Русский (Russia)
        'uk', // Україна (Ukraine)
        'bg', // България (Bulgaria)

    Other languages can be added on request.


    *** WARNING ***
    Any changes you make to this code will be wiped out in the next update!

    Does not have any "Save settings" capability - a future version will.

*/

(function () {
    'use strict';

    // - console LOG "label" - used for filtering console logs.
    const LOG = '-- fbcmf :: ';

    // - global vars to "remember"
    const VARS = {
        // -- master feed container's rule
        feedContainer: 'div[data-type="vscroller"]',
        feedSize: 0,

        // -- posts' rule (placed here as it is used more than once in the script)
        // -- actual posts have the attribute 'data-tracking-duration-id'.
        postContainer: 'div[data-type="vscroller"] > div[data-mcomponent="MContainer"][data-tracking-duration-id]',

        // -- error trapping ...
        hasError: false,
        timerId: null,

        // -- remember current URL - used for page change detection
        prevURL: '',
        prevPathname: '',
        prevQuery: '',

        // -- for timing component
        prevRuntime: Date.now(),
        // -- for scrolling component
        prevScrollY: window.scrollY,

        // -- posts' hide attributes ...
        attrHide: 'fbcmf',
        attrHideMode1: 'fbcmf-1',
        attrHideMode5: 'fbcmf-5',
        attrHideMode9: 'fbcmf-9',

        // -- which feed page is the user viewing?
        // - news
        isNF: false,
        // - groups
        isGF: false,
        // - any feed mentioned above.
        isAF: false,
    }

    // -- certain filters require dictionary of words to filter posts.

    const MASTER_KEYWORDS = {
        en: {
            SPONSORED: 'Sponsored',
            PAID_PARTNERSHIP: 'Paid partnership',
        },
        pt: {
            SPONSORED: 'Patrocinado',
            PAID_PARTNERSHIP: 'Parceria paga',
        },
        de: {
            SPONSORED: 'Gesponsert',
            PAID_PARTNERSHIP: 'Bezahlte Werbepartnerschaft',
        },
        fr: {
            SPONSORED: 'Sponsorisé',
            PAID_PARTNERSHIP: 'Partenariat rémunéré',
        },
        es: {
            SPONSORED: 'Publicidad',
            PAID_PARTNERSHIP: 'Colaboración pagada',
        },
        cs: {
            SPONSORED: 'Sponzorováno',
            PAID_PARTNERSHIP: 'Placené partnerství',
        },
        vi: {
            SPONSORED: 'Được tài trợ',
            PAID_PARTNERSHIP: 'Mối quan hệ tài trợ',
        },
        it: {
            SPONSORED: 'Sponsorizzato',
            PAID_PARTNERSHIP: 'Partnership pubblicizzata',
        },
        lv: {
            SPONSORED: 'Apmaksāta reklāma',
            PAID_PARTNERSHIP: 'Apmaksāta sadarbība',
        },
        pl: {
            SPONSORED: 'Sponsorowane',
            PAID_PARTNERSHIP: 'Post sponsorowany',
        },
        nl: {
            SPONSORED: 'Gesponsord',
            PAID_PARTNERSHIP: 'Betaald partnerschap',
        },
        he: {
            SPONSORED: 'ממומן',
            PAID_PARTNERSHIP: 'שותפות בתשלום',
        },
        ar: {
            SPONSORED: 'مُموَّل',
            PAID_PARTNERSHIP: 'شراكة مدفوعة',
        },
        id: {
            SPONSORED: 'Bersponsor',
            PAID_PARTNERSHIP: 'Kemitraan berbayar',
        },
        'zh-Hans': {
            SPONSORED: '赞助内容',
            PAID_PARTNERSHIP: '付费合伙',
        },
        'zh-Hant': {
            SPONSORED: '贊助',
            PAID_PARTNERSHIP: '付費合作',
        },
        ja: {
            SPONSORED: '広告',
            PAID_PARTNERSHIP: '有償パートナーシップ',
        },
        fi: {
            SPONSORED: 'Sponsoroitu',
            PAID_PARTNERSHIP: 'Maksettu kumppanuus',
        },
        tr: {
            SPONSORED: 'Sponsorlu',
            PAID_PARTNERSHIP: 'ücretli ortaklık',
        },
        el: {
            SPONSORED: 'Χορηγούμενη',
            PAID_PARTNERSHIP: 'Πληρωμένη συνεργασία',
        },
        ru: {
            SPONSORED: 'Реклама',
            PAID_PARTNERSHIP: 'Платное партнерство',
        },
        uk: {
            SPONSORED: 'Спонсорована',
            PAID_PARTNERSHIP: 'Оплачуване партнерство',
        },
        bg: {
            SPONSORED: 'Спонсорирано',
            PAID_PARTNERSHIP: 'Платено партньорство',
        },
    };

    // -- above keywords converted into a Regular Expression pattern.
    const DICTIONARY_PATTERN = {
        SPONSORED: '',
        PAID_PARTNERSHIP: ''
    }

    function generateDictionaryPattern() {
        for (let dpKey in DICTIONARY_PATTERN) {
            let allWords = '';
            for (let lang in MASTER_KEYWORDS) {
                allWords += MASTER_KEYWORDS[lang][dpKey].toLowerCase + '|';
            }
            allWords = allWords.slice(0, -1).trim(); // remove last '|'
            DICTIONARY_PATTERN[dpKey] = new RegExp(allWords);
        }
    }
    generateDictionaryPattern();

    try {

        // -- CSS styles ...
        const styles =
            `
/* add spacing between posts */
${VARS.postContainer} {
    margin-top: 2rem;
}
/* hide a post completely */
[${VARS.attrHideMode1}] {
    height: 0;
    margin: 0;
    display: none !important;
}
/* partly hide a post by applying opacity */
[${VARS.attrHideMode5}] {
   opacity: 0.2;
}
/* flag a post to be hidden */
[${VARS.attrHideMode9}] {
   border: 3px solid orangered;
}
/* make the borders become somewhat visible */
[${VARS.attrHide}] > div {
   width: 100% !important;
}
/* apply different border colours to certain flagged posts */
[${VARS.attrHide}="Sponsored"] {
   border: 3px solid red;
}
[${VARS.attrHide}="Paid partnership"] {
   border: 3px solid purple;
}
[${VARS.attrHide}="Suggested"] {
   border: 3px solid blue;
}
`;
        GM_addStyle(styles);



        // *** Various utility functions
        function isSponsored(header) {
            // -- detect a sponsored post
            // -- dictionary based rule
            //return (header.innerText.toLowerCase().includes('sponsored'));
            return DICTIONARY_PATTERN.SPONSORED.test(header.innerText.toLowerCase());
        }

        function isPaidPartnership(header) {
            // -- detect a Paid partnership post
            // -- dictionary based rule
            //return (header.innerText.toLowerCase().includes('paid partnership'));
            return DICTIONARY_PATTERN.PAID_PARTNERSHIP.test(header.innerText.toLowerCase());
        }

        function isSuggested(header) {
            // -- detect a post with a "Join" button (suggestions)
            // -- html structure based rule
            return header.querySelector(':scope > div > div:nth-of-type(3) > div > div > div > div > span') !== null;
        }

        function isFollow(header) {
            // -- detect a post with a "Follow" button
            // -- html structure based rule
            // -- requires this specific structure as not to include the "Add to story" component.

            return header.querySelector(':scope > div > div:nth-of-type(2) > div:nth-of-type(3) > div > span') !== null;
            // return header.querySelector(':scope > div > div:nth-of-type(2) > div:nth-of-type(3) > button > span') !== null;
        }

        function isNuisance(header) {
            // -- nuisance / unwanted post
            // -- html structure based rule
            // -- (middle cell's first block has hidden "...")
            const headerCells = header.querySelectorAll(':scope > div > div');
            //console.info(headerCells);
            if (headerCells.length < 2) {
                return false;
            }
            const cell2 = headerCells[1];
            const cell2Block1 = cell2.children[0];
            // console.info('cell2Block1:', cell2Block1);
            return (parseInt(cell2Block1.style.height) === 0);
        }

        function isSuggestionType(post) {
            // -- various types of suggested group post
            // -- from a group with members who like <xyz>
            // -- xyz is a member
            // -- based on your recent activity
            // -- <suggestion header>
            // -- <1px spacer>
            // -- <group...>
            return (post.children[1] && parseInt(post.children[1].style.height) === 1);
        }

        function isReels(post) {
            // -- "Reels"
            // -- detecting the play icon (no <video> in post until it is played)
            return (post.querySelectorAll('div.not-snappable ~ div div > div > div > div[style*="width:32px"] > span').length > 0) ;
        }


        function gf_isNuisance(post) {
            // -- posts from groups you're not a member of and doesn't have the suggestive header. Yeah, those irritating posts.
            return false;
            // -- needs more work ...
            const spanElement = post?.children[0]?.children[0]?.children[2]?.querySelector('div > div > div > div > span');
            return spanElement !== null ? true : false;
        }

        function hidePost(container, reason = '-', hideMode = 9) {
            // -- hide a post, based on the hideMode
            if (hideMode === 1) {
                // -- completely hide the post
                container.setAttribute('data-actual-height', '0');
                container.style.height = '0';
                container.setAttribute(VARS.attrHideMode1, '');
                container.setAttribute(VARS.attrHide, reason);
            }
            else if (hideMode === 5) {
                // -- apply opacity
                container.setAttribute(VARS.attrHideMode5, '');
                container.setAttribute(VARS.attrHide, reason);
            }
            else if (hideMode === 9) {
                // -- apply border style.
                container.setAttribute(VARS.attrHideMode9, '');
                container.setAttribute(VARS.attrHide, reason);
            }
        }

        function burnThePaperCuts() {
            // -- remove those pesky 1px containers, so we can apply proper spacing between posts (via CSS)
            // -- FB doesn't like them being deleted ... hence setting them to "0"....
            let arrPaperCuts = document.querySelectorAll('div[data-type="vscroller"] > div[data-mcomponent="MContainer"][data-actual-height="1"]');
            arrPaperCuts.forEach(paperCut => {
                paperCut.dataset.actualHeight = '0';
                paperCut.style.height = '0';
                paperCut.style.marginTop = '0';
            });

            if (VARS.isGF) {
                // -- additional for GF
                arrPaperCuts = document.querySelectorAll('div[data-type="vscroller"] > div[data-mcomponent="TextArea"][style*="height:1px"]');
                arrPaperCuts.forEach(paperCut => {
                    paperCut.dataset.actualHeight = '0';
                    paperCut.style.height = '0';
                    paperCut.style.marginTop = '0';
                });
            }
        }

        function cleanOutScraps(post) {
            // -- a fugly post ...

            // *** BETA ***
            // - some posts maybe valid (yet to see one ...)

            // -- variation #1:
            // -- three posts made to look like one post ...
            // -- <Suggested page> (#1 post)
            // -- <name of sponsor | Sponsored> (#2 post)
            // -- <suggested pages | See All Suggested Pages> (#3 post)
            // -- fuglyPost is the <suggested pages> post. (#3 post)

            // -- variation #2:
            // -- one post
            // -- <name, here are groups you might like | Join/Remove, Join/Remove | Discover more groups>

            console.info(LOG + 'cleanOutBrochures(); found a fugly post:', post);

            const secondPost = post.previousSibling;
            const spActualHeight = parseInt(secondPost.dataset.actualHeight);
            if (isNaN(spActualHeight) === false && spActualHeight < 2) {
                // -- variation #2
                hidePost(post, 'Discover', 5);
            }
            else {
                // -- variation #1
                const firstPost = secondPost.previousSibling;
                hidePost(post, 'Suggested - trio 3/3', 5);
                hidePost(secondPost, 'Suggested - trio 2/3', 5);
                hidePost(firstPost, 'Suggested - trio 1/3', 5);
            }
            return;
        }

        // *** main News Feed function
        function mopUpTheNewsFeed() {

            // -- if an error has occurred .. Do not pass Go, do not collect €500
            if (VARS.hasError) {
                oopsBrokeTheMop();
                return;
            }

            try {

                // -- caller said there might be something to do ...
                const collectionOfPosts = document.querySelectorAll(`${VARS.postContainer}:not([${VARS.attrHide}])`);
                collectionOfPosts.forEach((post) => {

                    // -- get the <element> that has the post's date/time/<certain phrases>
                    const headerMeta = post.querySelector(':scope > div > div > div:nth-of-type(2) > div:last-of-type > div > span:first-of-type');

                    // console.info(LOG + 'mopping(); headerMeta: ', headerMeta, post);

                    if (headerMeta === null) {
                        // -- not a typical post
                        // -- various flavours
                        // -- Reels
                        // -- Xyz, here are groups you might like
                        // -- A trio of posts made to look like one (Suggested Page + Sponsored + Suggested Page + See all suggested pages)
                        if (isReels(post)) {
                            // -- not hiding these ...
                        }
                        else {
                            cleanOutScraps(post);
                        }
                    }
                    else if (isSponsored(headerMeta)) {
                        // -- sadly, Sponsored posts do not have a unique structure/pattern (that I can see)
                        // -- using the dictionary based approach to detect these posts.
                        hidePost(post, 'Sponsored', 1);
                    }
                    else if (isPaidPartnership(headerMeta)) {
                        // -- likewise for PP.
                        hidePost(post, 'Paid partnership', 1);
                    }
                    else {
                        // -- using the html structure based filter/rules to detect other types of posts to hide

                        // -- break down the post into major components
                        let blocks = post.querySelectorAll(':scope > div');
                        // -- sometimes the first block is a dummary block ...
                        let bX = 0;
                        let header = blocks[bX++];
                        if (header.querySelector(':scope > div > div > div') === null) {
                            // -- dummy block ... next one is the actual header ...
                            header = blocks[bX++];
                        }
                        // - future use:
                        // let content = blocks[bX++];
                        // let media = blocks[bX++];
                        // let reactions = blocks[bX++];
                        // let actions = blocks[bX++];

                        if (isSuggested(header)) {
                            // -- structure based filter
                            hidePost(post, 'Suggested', 1);
                        }
                        else if (isFollow(header)) {
                            // -- structure based filter
                            hidePost(post, 'Follow', 1);
                        }
                        else if (isNuisance(header)) {
                            // -- a nuisance ... BETA!!!
                            // -- structure based filter
                            hidePost(post, 'Nuisance', 1);
                        }
                    }
                });

                // :: for testing purposes ::
                //throw new Error('Oops, ran out of detergent!');
            }
            catch (err) {
                VARS.hasError = true;
                oopsBrokeTheMop(err);
            }
        }


        // ** main Groups Feed function
        function mopUpTheGroupsFeed() {


            // -- if an error has occurred .. Do not pass Go, do not collect €500
            if (VARS.hasError) {
                oopsBrokeTheMop();
                return;
            }
            try {
                // -- caller said there might be something to do ...
                const collectionOfPosts = document.querySelectorAll(`${VARS.postContainer}:not([${VARS.attrHide}])`);
                collectionOfPosts.forEach((post) => {

                    if (isSuggestionType(post)) {
                        hidePost(post, 'Suggested', 1);
                    }
                    else if (gf_isNuisance(post)) {
                        hidePost(post, 'Nuisance');
                    }

                });

                // :: for testing purposes ::
                //throw new Error('Oops, ran out of detergent!');
            }
            catch (err) {
                VARS.hasError = true;
                oopsBrokeTheMop(err);
            }

        }


        function processPage(eventType = 'timing') {

            // -- if an error has occurred .. DO NOT PASS
            if (VARS.hasError) {
                oopsBrokeTheMop();
                return;
            }
            try {

                let feedContainer = document.querySelector(VARS.feedContainer);
                if (!feedContainer) {
                    //console.info(LOG + 'processPage(' + eventType + '); - no feed container found! Rule: ', VARS.feedContainer);
                    return;
                }
                if (feedContainer.innerHTML.length === VARS.feedSize) {
                    //console.info(LOG + 'processPage(' + eventType + '); - feed container\'s size has not changed. ', VARS.feedContainer, feedContainer.innerHTML.length, VARS.feedSize);
                    return;
                }

                // -- who is calling this function?
                console.info(LOG + "processpage(); eventType: " + eventType);

                // -- let's have a bonfire!
                burnThePaperCuts();


                if (VARS.isNF) {
                    // -- News Feed ...
                    mopUpTheNewsFeed();
                }
                else if (VARS.isGF) {
                    // -- Groups Feed ...
                    mopUpTheGroupsFeed();
                }

                // -- remember a couple of things for the next call ...
                VARS.feedSize = feedContainer.innerHTML.length;
                VARS.prevRuntime = Date.now();

                // :: for testing purposes ::
                //throw new Error('Oops, ran out of detergent!');
            }
            catch (err) {
                VARS.hasError = true;
                oopsBrokeTheMop(err);
            }
        }


        function evScrollHandler() {
            // -- user feeding their addiction ...

            if (VARS.hasError) {
                return;
            }

            let currentScrollY = window.scrollY;
            let scrollingDistance = currentScrollY - VARS.prevScrollY;
            if (Math.abs(scrollingDistance) > 50) {
                // console.info(LOG + 'scrolling: ', scrollingDistance, currentScrollY, VARS.prevScrollY);
                processPage('scrolling');
                VARS.prevScrollY = currentScrollY;
            }
        }

        function evCheckIn() {
            // -- check every ##ms to see if we need to do something

            if (VARS.hasError) {
                return;
            }

            // -- has the url changed?
            if (VARS.prevURL !== window.location.href) {
                console.info(LOG + 'url-changed:', VARS.prevURL, window.location.href);

                // - remember current page's URL
                VARS.prevURL = window.location.href;
                // -- pathname pattern: /marketplace...
                VARS.prevPathname = window.location.pathname;
                // -- search pattern: ?query= ...
                VARS.prevQuery = window.location.search;
                // - reset feeds flags
                VARS.isNF = false;
                VARS.isGF = false;
                VARS.isAF = false;

                if ((VARS.prevPathname === '/') || (VARS.prevPathname === '/home.php')) {
                    // -- news feed
                    VARS.isNF = true;
                }
                else if (VARS.prevPathname.indexOf('/groups/') >= 0) {
                    // -- groups feed
                    VARS.isGF = true;
                }
                // -- a known feed
                VARS.isAF = (VARS.isNF || VARS.isGF);

                console.info(LOG + 'evCheckIn(); IS:', VARS.isAF, VARS.isNF, VARS.isGF);

                processPage('url-changed');
            }
            else {
                // -- how long was the user distracted for ...
                const dtNow = Date.now();
                if (dtNow - VARS.prevRuntime > 1000) {
                    // -- been a while since last successful run .. check in ...
                    processPage('checking in ...');
                }
            }
        }

        function oopsBrokeTheMop(err) {
            console.info(LOG + 'Ooops! Broke the Mop! (Stopping the events ...)');
            console.error('Error in fb-cmf (mobile) script:' + err);
            clearInterval(VARS.timerId);
            window.removeEventListener('scroll', evScrollHandler);
        }

        // :: for testing purposes ::
        // throw new Error('Knocked the bucket over!!!');

        function startUp() {
            // -- run code soon as the elements HEAD, BDDY are available.
            if (document.head && document.body) {

                // -- start cleaning ...
                // processPage('initialising');

                // -- start cleaning ...
                setTimeout(function () {
                    // -- check in every ##ms ...
                    VARS.timerId = setInterval(evCheckIn, 500);
                }, 100);


                // -- add some event listeners to detect if something is being changed ...
                window.addEventListener('scroll', evScrollHandler);


            }
            else {
                setTimeout(startUp, 10);
            }
        }
        // setTimeout(startUp, 50);
        startUp();

    }
    catch (err) {
        //-- catches the non-nested errors ...
        VARS.hasError = true;
        console.error(err);
    }

})();
