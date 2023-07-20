// ==UserScript==
// @name         Sort products on zulily.com
// @namespace    Sort_products_on_zulily.com
// @version      0.1
// @description  Sort products on zulily.com by prices
// @author       You
// @match        https://www.zulily.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zulily.com
// @grant        none
// @noframes
// @run-at       document-start
// ==/UserScript==

/*
  Userscript will add 3 buttons on various zulily.com pages.
  button 1: sort prices (0 - 9)
  button 2: sort prices (9 - 0)
  button 3: restore original order of products
*/


(function() {
    'use strict';

    const LOG_NAME = 'Sorting products: ';
    const ATT_ORIGINAL_ORDER = 'ooop'; // - Original Order Of Products
    const ATT_HAVE_BUTTONS = 'spoz'; // - (s)ort (p)roducts (o)n (z)ulily
    const ATT_PRICE = 'spozp'; // - (s)ort (p)roducts (o)n (z)ulily (p)price

    const queryContainer = 'div#products-list-container > ul'; // - which element has the listing of products

    // const currencyPatttern = /\d+(\.\d+)?/; // - Regular expression to match a number with a decimal point anywhere in the string
    const currencyPatttern = /[+-]?[0-9]{1,3}(?:,?[0-9]{3})*\.[0-9]{2}/; // source: https://stackoverflow.com/questions/354044/what-is-the-best-u-s-currency-regex

    const CSS = `
[${ATT_HAVE_BUTTONS}] {
    text-align: center;
    padding: 0.25rem 1rem;
    flex-grow: 1;
}
[${ATT_HAVE_BUTTONS}] button {
    margin: 0 0.65rem;
    font-size: 0.8rem;
    border-radius: 0.25rem;
}
`;

    function convertTextToNumber(thePrice) {
        let tempPrice = '0.00';
        if (['0','1','2','3','4','5','6','7','8','9'].indexOf(thePrice[0]) > 0) {
            // -- does not have a currency symbol as first character
            tempPrice = thePrice;
        }
        else {
            // -- remove the currency symbol.
            tempPrice = thePrice.slice(1);
        }
        // -- drop the comma(s).
        tempPrice = tempPrice.replace(/,/g, '');
        // -- convert to float and keep 2 digits after decimal.
        return parseFloat(tempPrice).toFixed(2);
    }

    function scanForTextNodePrice(parentNode) {
        // -- given a node that has price(s), return the last text node's value.
        // -- some items may have a price range, so we return the last value which is the biggest number.
        let textPrice = ' 0.00';
        for (const childNode of parentNode.childNodes) {
            // -- find the node that has the price.
            if (childNode.nodeType === Node.TEXT_NODE) {
                textPrice = childNode.nodeValue.trim();
            }
        }
        return textPrice;
    }

    function generateSortKey(value, name, sortOrder) {
        // -- fyi, by default, array.sort() is string based.
        let sortKey;
        if (sortOrder === 'ascending') {
            // -- after slicing, maximum text number is 999999999.99 (999,999,999.99)
            sortKey = ('000000000000' + String(value)).slice(-12);
        }
        else {
            sortKey = String(1000000000000 - value);
        }
        sortKey += "~" + name;
        // console.info(LOG_NAME + 'sortKey:', sortKey);
        return sortKey;
    }

    function sortProducts(sortOrder='ascending') {
        try {
            if (['ascending', 'descending'].indexOf(sortOrder) < 0) {
                return 'Unknown sortOrder value: ' + sortOrder;
            }
            const elContainer = document.querySelector(queryContainer);
            if (elContainer) {
                const arrayProducts = elContainer.querySelectorAll(':scope > li');
                if (arrayProducts.length > 0) {
                    if (arrayProducts[0].hasAttribute(ATT_ORIGINAL_ORDER) === false) {
                        // -- remember the original order - for use in restoring the original order.
                        for (let i = 0; i < arrayProducts.length; i++) {
                            arrayProducts[i].setAttribute(ATT_ORIGINAL_ORDER, i);
                        }
                    }
                    if (arrayProducts.length > 1) {
                        // -- create a 2d array, each item: [sortKey (price + name), <element>]
                        const arrayData = Array.from(arrayProducts).map((elProduct) => {
                            let price = 0.00;
                            let name = '';
                            // -- check if product item or not
                            const elName = elProduct.querySelector('.product-name');
                            if (elName !== null) {
                                if (elProduct.hasAttribute(ATT_PRICE)) {
                                    // -- found the price in a previous sort run.
                                    price = convertTextToNumber(elProduct.getAttribute(ATT_PRICE));
                                }
                                else {
                                    // -- get the price, slice off the '$', and convert to number data-type.
                                    // -- various pricing schemes ...
                                    const elPriceMap = elProduct.querySelector('.map-price');
                                    const elPriceSpecial = elProduct.querySelector('.special-price');
                                    const elPriceOld = elProduct.querySelector('.old-price');
                                    if (elPriceSpecial) {
                                        // -- has two prices, grab the special/discount
                                        price = convertTextToNumber(scanForTextNodePrice(elPriceSpecial));
                                    }
                                    else if (elPriceMap) {
                                        // -- the priceMap has a couple formats, so test which is which ...
                                        if (currencyPatttern.test(elPriceMap.textContent)) {
                                            // -- format #1: original price, no "see ..." etc..
                                            price = convertTextToNumber(elPriceMap.textContent);
                                        }
                                        else {
                                            // -- format #2: "See Price In Basket", has original price in another element.
                                            price = convertTextToNumber(scanForTextNodePrice(elPriceOld));
                                        }
                                    }
                                    elProduct.setAttribute(ATT_PRICE, price);
                                }
                                name = elName.textContent.trim();
                            }
                            else {
                                // -- promotion item (no price)
                                price = (sortOrder === 'ascending') ? 1000000.00: 0.00;
                                name = 'promotion item';
                            }
                            // console.info(LOG_NAME + 'price:', price, name, elProduct);
                            return [generateSortKey(price, name, sortOrder), elProduct];
                        });
                        // -- sort the data
                        // -- nb: generateSortKey() has already done the magic with sortKey ..
                        arrayData.sort();

                        // -- update the list of products
                        arrayData.forEach( (item) => {
                            elContainer.appendChild(item[1]);
                        });
                        return 'Products sorted';
                    }
                    else {
                        return 'One product found - no need to execute sort code';
                    }
                }
                else {
                    return 'No products found';
                }
            }
            else {
                return 'No products list container found';
            }
        }
        catch (error) {
            console.error(LOG_NAME + 'function sortProducts(); Error:', error);
        }
    }

    function restoreProductsOriginalOrder() {
      try {
            const elContainer = document.querySelector(queryContainer);
            if (elContainer) {
                const arrayProducts = elContainer.querySelectorAll(':scope > li');
                if (arrayProducts.length > 0) {
                    if (arrayProducts[0].hasAttribute(ATT_ORIGINAL_ORDER) === false) {
                        // -- remember the original order - for use in restoring the original order.
                        for (let i = 0; i < arrayProducts.length; i++) {
                            arrayProducts[i].setAttribute(ATT_ORIGINAL_ORDER, i);
                        }
                        return 'Products have not been sorted before.' ;
                    }
                    if (arrayProducts.length > 1) {
                        // -- create a 2d array, each item: [orginal sort order value, <element>]
                        const arrayData = Array.from(arrayProducts).map((elProduct) => {
                            let originalOrder = convertTextToNumber(elProduct.getAttribute(ATT_ORIGINAL_ORDER));
                            return [generateSortKey(originalOrder, '', 'ascending'), elProduct];
                        });
                        // -- sort the data
                        // -- nb: generateSortKey() has already done the magic with sortKey ..
                        arrayData.sort();

                        // -- update the list of products
                        arrayData.forEach( (item) => {
                            elContainer.appendChild(item[1]);
                        });
                        return 'Products sorted';
                    }
                    else {
                        return 'One product found - no need to execute sort code';
                    }
                }
                else {
                    return 'No products found';
                }
            }
            else {
                return 'No products list container found';
            }
        }
        catch (error) {
            console.error(LOG_NAME + 'function restoreProductsOriginalOrder(); Error:', error);
        }

    }

    function addSortButtons() {
        // -- add Sort buttons - descending + ascending
        try {
            // -- look for a place for the buttons.
            const pathnameBits = window.location.pathname.split('/');
            if (pathnameBits.length === 1) {
                return [100, 'Home page doesn\'t list products\' prices'] ;
            }
            if (pathnameBits.length === 2) {
                return [100, 'Don\'t think there is a listing of products on this page'];
            }
            let query = '';
            let elFilterBar = null;
            if (pathnameBits[1] === 'e') {
                elFilterBar = document.querySelector('div#filter > form');
            }
            else if (pathnameBits[1] === 'category') {
                elFilterBar = document.querySelector('div.navigation-sort');
            }
            else {
                return [100, 'Not adding sort buttons to this page.'];
            }
            if (elFilterBar === null) {
                return [0, 'Filter bar not found'];
            }
            if (elFilterBar.hasAttribute(ATT_HAVE_BUTTONS) === false) {
                // -- buttons ...
                const containerButtons = document.createElement('div');
                containerButtons.setAttribute(ATT_HAVE_BUTTONS, '1');

                // -- button : sort ascending
                const btnSortAsc = document.createElement('button');
                btnSortAsc.textContent = '0 -> 9';
                btnSortAsc.id = 'BTN_SortAsc';

                // -- button: sort descending
                const btnSortDesc = document.createElement('button');
                btnSortDesc.textContent = '9 -> 0';
                btnSortDesc.id = 'BTN_SortDesc';

                // -- button: restore
                const btnRestore = document.createElement('button');
                btnRestore.textContent = 'Restore';
                btnRestore.id = 'BTN_Restore';

                // -- add buttons to buttons' container
                containerButtons.appendChild(btnSortAsc);
                containerButtons.appendChild(btnSortDesc);
                containerButtons.appendChild(btnRestore);

                // -- add container to filter bar
                if (pathnameBits[1] === 'e') {
                    elFilterBar.appendChild(containerButtons);
                }
                else if (pathnameBits[1] === 'category') {
                    elFilterBar.appendChild(containerButtons);
                }
                else {
                    return [100, 'Not too sure where to place the buttons!'];
                }

                // -- add click events ..
                btnSortAsc.addEventListener('click', () => {
                    event.preventDefault();
                    const results = sortProducts('ascending');
                    //console.info(LOG_NAME, results);
                });

                btnSortDesc.addEventListener('click', () => {
                    event.preventDefault();
                    const results = sortProducts('descending');
                    //console.info(LOG_NAME, results);
                });

                btnRestore.addEventListener('click', () => {
                    event.preventDefault();
                    const results = restoreProductsOriginalOrder();
                    //console.info(LOG_NAME, results);
                });

                // -- add some styling to the buttons
                const style = document.createElement('style');
                style.textContent = CSS;
                document.head.appendChild(style);

                return [100, 'Added sort buttons'];
            }
        }
        catch (error) {
            console.error(LOG_NAME + 'function addSortButtons(); Error:', error);
            return [100, 'Error'];
        }
    }


    // -- run script when a certain element is available.
    let counter = 0;
    function checkForProductsContainer() {

        const results = addSortButtons();
        //console.info(LOG_NAME + 'checkForProductsContainer(); results:', results);
        if (results[0] === 100) {
            return;
        }
        else {
            // -- try again in 50ms, max retries is ...
            counter++;
            if (counter < 51) {
                setTimeout(checkForProductsContainer, 50);
            }
        }
    }


    // -- monitor the page's content being reloaded, but page is not reloaded.
    // -- using MutationObserver to do the monitoring.
    // -- - url's query is changing (? with &)
    // -- - popstate is not being triggered.
    // -- - hashchange is no good (no "#" in url).
    let currentURL = '';

    // -- Create a new MutationObserver instance
    const observer = new MutationObserver(function(mutationsList, observer) {
        mutationsList.forEach((mutation) => {
            if (mutation.type === 'childList') {
                // -- Child nodes have been added or removed, indicating a possible URL change
                const newUrl = window.location.href;
                if (currentURL !== newUrl) {
                    setTimeout(checkForProductsContainer, 1500);
                    currentURL = newUrl;
                }
            }
        });
    });

    // -- Observe changes to the document's body
    let bcounter = 0;
    function runMO() {
        if (document.body) {
            // console.info(LOG_NAME + 'runMO(); running!');
            observer.observe(document.body, { childList: true, subtree: true });
        }
        else {
            // -- BODY is not yet available ... wait a few more ms before trying agin.
            bcounter++;
            if (bcounter < 50) {
                setTimeout(runMO, 50);
            }
        }
    }
    runMO();

})();
