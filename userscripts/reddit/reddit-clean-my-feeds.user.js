// ==UserScript==
// @name         reddit - clean my feeds
// @description  Hide articles/posts in reddits feeds, based on certain keywords
// @version      0.1
// @author       zbluebugz
// @match        https://www.reddit.com
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAANUlEQVRIS+3SsQkAAAwCQd1/aUf4yu5TS4TD5nw9/48FKCyRRCiAAVckEQpgwBVJhAIYuK9oesQAGQOvmYAAAAAASUVORK5CYII=
// @noframes
// @license      MIT; https://opensource.org/licenses/MIT
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
  
    // -- list of 'annoying' keywords to find in articles
    const ignoreKeywords = [
        'Jokers',
        'moonshiners'
    ].map(keyword => keyword.toLowerCase());

    function addCSS() {
        const css = `
            div[cmfr-x] {
                border: 3px dotted orangered;
            }
            div[cmfr] {
                display: none !important;
            }
        `;
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    function getArticleText(article) {

        const elTitle = article.querySelector('[data-adclicklocation="title"] > div');
        if (!elTitle) {
            return '';
        }
        const elContent = article.querySelector('[data-adclicklocation="title"] ~ div');
        if (!elContent) {
            return '';
        }

        const title = elTitle.innerText.toLowerCase();
        const content = elContent.innerText.toLowerCase().split('\n');

        const images = Array.from(article.querySelectorAll('[data-adclicklocation="title"] ~ div img'));
        const imagesText = images.flatMap(img => {
            const alt = img.alt ? img.alt.toLowerCase() : '';
            const title = img.title ? img.title.toLowerCase() : '';
            return [alt, title].filter(text => text.length > 0);
        });

        let articleText = new Set([title, ...content, ...imagesText]);
        articleText = Array.from(articleText).filter((item) => item.trim() !== '').join(' ');

        // console.info('article:::', articleText, article);

        return articleText;
    }

    function hasIgnoreKeyword(articleText) {
        if (articleText === '') {
            return '';
        }
        const blockedText = ignoreKeywords.find(keyword => articleText.includes(keyword));
        return blockedText || '';
    }

    function processArticles() {

        const firstArticle = document.querySelector('div[data-scroller-first]');

        if (firstArticle) {
            const articles = Array.from(firstArticle.parentElement.querySelectorAll(':scope > div:not([cmfs])'));
            // console.info('Found:', articles.length);
            articles.forEach(article => {
                const results = hasIgnoreKeyword(getArticleText(article));
                // -- debugging:
                // console.info('article:::', results, articleContent, article);
                article.setAttribute('cmfs', '1');
                if (results.length > 0) {
                    article.setAttribute('cmfr', results);
                }
            });
        }
    }


    // ** Mutations processor
    function bodyMutating(mutations) {
        for (let mutation of mutations) {
            if ((mutation.type === 'childList') && (mutation.addedNodes.length > 0)) {
                processArticles();
            }
        }
    };

    // ** Mutation Observer
    let bodyObserver = new MutationObserver(bodyMutating);

    // ** MO starter / restarter
    function runMO() {
        // run code soon as the elements HEAD and BDDY are ready/available.
        if (document.head && document.body) {
            addCSS();
            // - clear out mutations not yet processed ...
            let mutations = bodyObserver.takeRecords();
            bodyObserver.disconnect();
            // - and start up the osbserver again.
            bodyObserver.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: false
            });
        }
        else {
            // HEAD / BODY / Options not yet ready ...
            // -- try again ...
            // console.info(log + 'runMO(); - not yet ready ...');
            setTimeout(runMO, 10);
        }
    }
    runMO();

})();
