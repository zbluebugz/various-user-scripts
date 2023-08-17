// ==UserScript==
// @name         amazon.com - display the full star ratings
// @namespace    _amazon_display_stars_
// @version      0.1
// @description  Change the number of stars being displayed from 1 to 5.
// @author       You
// @match        https://www.amazon.com/*
// @match        https://www.amazon.co.uk/*
// @match        https://www.amazon.com.au/*
// @match        https://www.amazon.com.br/*
// @match        https://www.amazon.ca/*
// @match        https://www.amazon.cn/*
// @match        https://www.amazon.fr/*
// @match        https://www.amazon.de/*
// @match        https://www.amazon.in/*
// @match        https://www.amazon.it/*
// @match        https://www.amazon.jp/*
// @match        https://www.amazon.mx/*
// @match        https://www.amazon.nl/*
// @match        https://www.amazon.pl/*
// @match        https://www.amazon.sg/*
// @match        https://www.amazon.es/*
// @match        https://www.amazon.tr/*
// @match        https://www.amazon.ae/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        none
// @noframes
// @run-at       document-body
// ==/UserScript==

/*
  When viewing product listings, amazon sometimes display one star with the rating number next to it.
  We need to see the 5 stars, not 1 star.

  -- original showing one star:
  <i class="a-icon a-icon-star-small a-star-small-5 aok-align-bottom puis-review-star-single">

  -- what's needed to show 5 stars
  <i class="a-icon a-icon-star-small a-star-small-4-5 aok-align-bottom">

  NB: Both elements are copied from amazon.

  NB: Not all amazon sites use the display 1 star pattern.
  Some do, some don't, some have a mixture ...

*/


(function() {
    'use strict';

    const ATT_SEEN = 'adfsr';
    const LOG_NAME = 'ADFSR :: ';

    const RATING_CLASSES = {
        0.0: 'a-star-0',
        0.1: 'a-star-0',
        0.2: 'a-star-0',
        0.3: 'a-star-0-5',
        0.4: 'a-star-0-5',
        0.5: 'a-star-0-5',
        0.6: 'a-star-0-5',
        0.7: 'a-star-0-5',
        0.8: 'a-star-1',
        0.9: 'a-star-1',
        1.0: 'a-star-1',
        1.1: 'a-star-1',
        1.2: 'a-star-1',
        1.3: 'a-star-1-5',
        1.4: 'a-star-1-5',
        1.5: 'a-star-1-5',
        1.6: 'a-star-1-5',
        1.7: 'a-star-1-5',
        1.8: 'a-star-2',
        1.9: 'a-star-2',
        2.0: 'a-star-2',
        2.1: 'a-star-2',
        2.2: 'a-star-2',
        2.3: 'a-star-2-5',
        2.4: 'a-star-2-5',
        2.5: 'a-star-2-5',
        2.6: 'a-star-2-5',
        2.7: 'a-star-2-5',
        2.8: 'a-star-3',
        2.9: 'a-star-3',
        3.0: 'a-star-3',
        3.1: 'a-star-3',
        3.2: 'a-star-3',
        3.3: 'a-star-3-5',
        3.4: 'a-star-3-5',
        3.5: 'a-star-3-5',
        3.6: 'a-star-3-5',
        3.7: 'a-star-3-5',
        3.8: 'a-star-4',
        3.9: 'a-star-4',
        4.0: 'a-star-4',
        4.1: 'a-star-4',
        4.2: 'a-star-4',
        4.3: 'a-star-4-5',
        4.4: 'a-star-4-5',
        4.5: 'a-star-4-5',
        4.6: 'a-star-4-5',
        4.7: 'a-star-4-5',
        4.8: 'a-star-5',
        4.9: 'a-star-5',
        5.0: 'a-star-5'
    };

    const queryRatingElements =
          `span[aria-label]:not([${ATT_SEEN}]) > span.a-size-base.puis-normal-weight-text, ` +
          `span[aria-label]:not([${ATT_SEEN}]) > span.a-size-base.puis-bold-weight-text`;

    function updateDisplayOfStars() {
        try {
            const collectionOfRatings = document.querySelectorAll(queryRatingElements);
            for (const spanRating of collectionOfRatings) {
                const newRatingClass = RATING_CLASSES[parseFloat(spanRating.textContent)];
                if (newRatingClass !== null) {
                    const elStars = spanRating.parentElement.querySelector('span a > i.a-icon.a-star-small-5');
                    if (elStars) {
                        elStars.classList.add(newRatingClass);
                        elStars.classList.remove('a-star-small-5');
                        elStars.classList.remove('puis-review-star-single');
                        spanRating.closest('[aria-label]').setAttribute(ATT_SEEN, '1');
                    }
                }
            }
        }
        catch (error) {
            console.error(LOG_NAME + 'Error: ', error)
        }
    }

    // -- run mutation observer ...
    function handleMutations(mutationsList, observer) {
        // -- slow down the number of calls to main function.
        const mutatedElementOfInterest = mutationsList.some((mutation) => Array.from(mutation.addedNodes).some((node) => node instanceof HTMLDivElement));
        if (mutatedElementOfInterest) {
            updateDisplayOfStars();
        }
    }
    const observer = new MutationObserver(handleMutations);
    observer.observe(document.body, { childList: true, subtree: true });

})();
