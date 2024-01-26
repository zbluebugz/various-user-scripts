// ==UserScript==
// @name         Instagram - Clean my feeds (109)
// @description  Hide Sponsored posts in Instagram's Feed; Add video controls; Add "Following" & "Favourites" links in the menu side-bar;
// @namespace    _I_CMF_
// @supportURL   https://github.com/zbluebugz/instagram-clean-my-feeds/issues
// @version      1.09
// @author       zbluebugz (https://github.com/zbluebugz/)
// @match        https://*.instagram.com/*
// @grant        none
// @license      MIT; https://opensource.org/licenses/MIT
// @icon64       data:image/png;base64,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
// @run-at       document-body
// ==/UserScript==

/*
    This userscript does not collapse articles
    - instead, it hides the contents of the articles
    - this fixes the scrolling issue
    - cannot delete the article(s) as instagram will throw an error and you have to reload the page.

    v1.10 :: August 2023
        Change method for hiding articles.
    v1.09 :: July 2023
        Changed hiding code to hide different elements
    v1.08 :: July 2023
        Suggested for you filter update
    v1.07 :: May 2023
    v1.06 :: April 2023
        Fixed issues with unable to use Video Controls bar in Chrome (move Tags button up, hide extra Mute button)
    v1.05 :: March 2023
        Updated Sponsored rule (IG changed it)
    v1.04 :: February 2023
        Updated sidebar menu code (add 2 x links)
    v1.03 :: November 2022
        Added Suggested block
    v1.02 :: November 2022
        Bug fix (video overlay)
    v1.01 :: November 2022
        Created script


    Attribution: Mop & Bucket icon:
    - made by Freepik (https://www.freepik.com) @ flaticon (https://www.flaticon.com/)
    - page: https://www.flaticon.com/premium-icon/mop_2383747

*/

(async function () {

    'use strict';

    const postAtt = 'icmfr';
    const log = 'icmf :: ';

    function setHideAttributes(element, ruleTriggered, isArticle = true) {
        let elContainer = (isArticle) ? element.closest('article') : element;
        elContainer.setAttribute(postAtt, ruleTriggered);
        const orgHeight = parseInt(elContainer.clientHeight);
        // let newHeight = parseInt(orgHeight * 0.75) + 'px';
        // const newHeight = parseInt(orgHeight * 0.575);
        const newHeight = parseInt(parseInt(orgHeight) * 0.675);
        //console.info(log + 'height:', orgHeight, newHeight, elContainer);
        elContainer.setAttribute('style', `border:1px dotted grey !important; height:${newHeight}px !important;`);
        elContainer.setAttribute(postAtt + '-oh', orgHeight);
        elContainer.setAttribute(postAtt + '-nh', newHeight);
        elContainer.childNodes.forEach(nodeChild => {
                nodeChild.setAttribute('style', `visibility:hidden !important;`);
        })
    }

    function hideArticles(articles, ruleTriggered) {
        articles.forEach(articleItem => {
            setHideAttributes(articleItem, ruleTriggered, true);
        })
    }

    function doCleanUpAndSomeRepairs() {

        let query = '';
        let articles;
        let ruleTriggered = '';

        // -- paid partnership - similar structure to sponsored ...
        query = `div > div > article:not([${postAtt}]) > div > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2) > div > div:nth-of-type(2) > span > div > span a`;
        articles = document.querySelectorAll(query);
        if (articles.length > 0) {
            hideArticles(articles, 'paid partnership');
        }

        // -- sponsored articles
        // -- June 2023 rule
        query = `div > div > article:not([${postAtt}]) > div > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2) > div > div:nth-of-type(2) > span > div > span`;
        articles = document.querySelectorAll(query);
        ruleTriggered = 'sponsored (202306)';

        if (articles.length === 0) {
            // -- try again - March 2023 rule
            query = `div > div > article:not([${postAtt}]) > div header > div > div > span> div > span`;
            articles = document.querySelectorAll(query);
            ruleTriggered = 'sponsored (202303)';
        }
        if (articles.length === 0) {
            // -- try again - pre March 2023 rule
            query = `div > div > article:not([${postAtt}]) > div > div > div > header > div:nth-of-type(2) > div:nth-of-type(2) > div > div > span`;
            articles = document.querySelectorAll(query);
            ruleTriggered = 'sponsored (202302)';
        }
        if (articles.length > 0) {
            hideArticles(articles, ruleTriggered);
        }

        // -- Suggested articles
        // -- Suggested for you
        // -- Because you liked a post from
        // -- Because you interacted with a post from
        // query = `div > div > article:not([${postAtt}]) > div > div > div > div > span`;
        // query = `div > div > article:not([${postAtt}]) > div > div > span`;
        // query = `div > div > article:not([${postAtt}]) > div:nth-of-type(1) > div:nth-of-type(1) > span`;
        // query = `div > div > article:not([${postAtt}]) > div:nth-of-type(1) > div:nth-of-type(1) > div > div > span`;
        query = `div > div > article:not([${postAtt}]) > div:nth-of-type(1) > div:nth-of-type(1) > span`
        articles = document.querySelectorAll(query);
        if (articles.length > 0) {
            hideArticles(articles, 'suggested/because you liked/because you interacted');
        }

        // -- Suggestions for you
        const querySFY = `section > div > div > div > div > div > div > div[class]:not([${postAtt}]) > div[class] > span[class] > div[class][dir="auto"]`;
        let sfyArticle = document.querySelector(querySFY);
        if (sfyArticle) {
            sfyArticle = sfyArticle.parentNode.parentNode.parentNode;
            setHideAttributes(sfyArticle, 'Suggestions for you', false);
        }

        // -- repair videos - enable controls and clean out overlays
        // -- haven't figured out how to stop Instagram autoplaying some videos ... user will have to click/tap on the video to stop it playing ...
        // -- move some video controls around abit (they're overlapping)
        let videos = Array.from(document.querySelectorAll('video:not([controls])'));
        if (videos.length > 0) {
            videos.forEach(vid => {
                // --- add controls
                vid.setAttribute('controls', 'controls');
                // --- remove the overlay(s)
                let pel = vid.parentElement.parentElement.parentElement;
                let nel = pel.nextSibling;
                if (nel) {
                    nel.setAttribute('style', 'display: none !important');
                    Array.from(nel.children).forEach(nchild => {
                        nchild.setAttribute('style', 'display: none !important');
                    });
                    let nel2 = nel.nextSibling;
                    let nel3 = nel2.nextSibling;
                    nel2.setAttribute('style', 'display: none !important');
                    nel3.setAttribute('style', 'display: none !important');
                }
                // -- move the "extra" audio button and tag button up a bit to allow video's controls to be usable.
                let article = vid.closest('article');
                // -- (reels page don't have 'article')
                if (article) {
                    //let elAudios = Array.from(article.querySelectorAll('div[class] > div:not([class]) > div:not([class]) > div[class] > div[class] > button[aria-label] > div > svg > title'));
                    let elIcons = article.querySelectorAll('button._acan > div > svg.x1lliihq.x1n2onr6 > title');
                    if (elIcons.length >= 0) {
                        //console.info('elIcons count:', elIcons.length, elIcons, article);
                        elIcons.forEach(icon => {
                            let btn = icon.closest('button');
                            let elContainer = btn.closest('div');
                            if (btn.hasAttribute('aria-label')) {
                                // -- volume button
                                // elContainer.style.display = 'none';
                                elContainer.style.bottom = '85px';
                            }
                            else {
                                // -- tags button (not all videos have this)
                                elContainer.style.bottom = '85px';
                            }
                        });
                    }
                }
            });
        }

        window.setTimeout(doCleanUpAndSomeRepairs, 250);
    }

    // -- extra menu items ...
    const extraMenuItems = [
        {
            menuDesc: 'Following',
            menuURL: '/?variant=following',
            menuLabel: '<div class="_ab8w  _ab94 _ab99 _ab9f _ab9m _ab9p  _abb1 _abcm"><svg aria-label="Following" class="_ab6-" color="rgb(38, 38, 38)" fill="rgb(38, 38, 38)" height="16" role="img" viewBox="0 0 24 24" width="16"><path d="M19.006 8.252a3.5 3.5 0 1 1-3.499-3.5 3.5 3.5 0 0 1 3.5 3.5Z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="2"></path><path d="M22 19.5v-.447a4.05 4.05 0 0 0-4.05-4.049h-4.906a4.05 4.05 0 0 0-4.049 4.049v.447" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path><polyline fill="none" points="8.003 9.198 4.102 13.099 2.003 11" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></polyline></svg></div><small style="padding:0.75rem 0.1rem;font-size:xx-small;">(Following)</small>',
            menuQuery: '[href="/?variant=following"]'
        },
        {
            menuDesc: 'Favourites',
            menuURL: '/?variant=favorites',
            menuLabel: '<div class="_ab8w  _ab94 _ab99 _ab9f _ab9m _ab9p  _abb1 _abcm"><svg aria-label="Favorites" class="_ab6-" color="rgb(38, 38, 38)" fill="rgb(38, 38, 38)" height="16" role="img" viewBox="0 0 24 24" width="16"><path d="M18.18 22.51a.99.99 0 0 1-.513-.142L12 18.975l-5.667 3.393a1 1 0 0 1-1.492-1.062l1.37-6.544-4.876-4.347a.999.999 0 0 1 .536-1.737l6.554-.855 2.668-5.755a1 1 0 0 1 1.814 0l2.668 5.755 6.554.855a.999.999 0 0 1 .536 1.737l-4.876 4.347 1.37 6.544a1 1 0 0 1-.978 1.205ZM12 16.81a1 1 0 0 1 .514.142l4.22 2.528-1.021-4.873a.998.998 0 0 1 .313-.952l3.676-3.276-4.932-.644a1 1 0 0 1-.778-.57L12 4.867l-1.992 4.297a1 1 0 0 1-.779.57l-4.931.644 3.676 3.276a.998.998 0 0 1 .313.951l-1.02 4.873 4.22-2.527A1 1 0 0 1 12 16.81Z"></path></svg></div><small style="padding:0.75rem 0.1rem;font-size:xx-small;">(Favourites)</small>',
            menuQuery: '[href="/?variant=favorites"]'
        }
    ];

    let menuTries = 0;
    function addMenuEntries() {
        // -- when you have the menu sidebar, Instagram does not list the "following" and "favourites" entries (have to resize page to be narrow and click on Instragram logo ...)
        // -- so, we put them in!
        let homeLinks = document.querySelectorAll('a[href="/"]');
        if (homeLinks.length > 0) {
            // -- sidebar menu is showing ...

            // -- test if an extra menu item exists or not, if not, add it.
            let emiLen = extraMenuItems.length - 1;
            for (let i = emiLen; i >= 0; i--) {
                let objMenuItem = extraMenuItems[i];
                let menuLink = document.querySelectorAll(objMenuItem.menuQuery);
                if (menuLink.length === 0) {
                    let elMenu = document.createElement('a');
                    elMenu.setAttribute('href', objMenuItem.menuURL);
                    elMenu.innerHTML = objMenuItem.menuLabel;
                    elMenu.setAttribute('role', 'link');
                    elMenu.setAttribute('tabindex', '0');
                    elMenu.setAttribute('style', 'display:block; margin:1rem 0;');
                    // console.info(log + 'addMenuEntries() - new el:', objMenuItem.menuDesc, elMenu);

                    let elMenuBox = document.createElement('div');
                    elMenuBox.appendChild(elMenu);

                    let homeBox = homeLinks[1]; // want #2 entry.
                    homeBox = homeBox.parentElement.parentElement.parentElement;
                    homeBox.insertAdjacentElement('afterend', elMenuBox);
                }
            }
        }
        else {
            // -- try again in about 1 second
            menuTries++;
            if (menuTries < 11) {
                window.setTimeout(addMenuEntries, 1000);
            }
        }
    };

    window.setTimeout(addMenuEntries, 1000);

    window.setTimeout(doCleanUpAndSomeRepairs, 250);

})();
