// ==UserScript==
// @name         OnfaCamper
// @namespace    http://tampermonkey.net/
// @version      2025-01-17
// @description  Tự động mua tranh
// @author       You
// @match        https://onfa.io/ecosystem/nft
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=onfa.io
// @run-at       document-end
// @downloadURL  https://raw.githubusercontent.com/qxbao/scripts/main/onfacamper.user.js
// @updateURL    https://raw.githubusercontent.com/qxbao/scripts/main/onfacamper.user.js
// ==/UserScript==

(async function() {
    'use strict';
    const delayTime = 2000;
    const price = 50;
    let wait = 0;
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const click = async (element) => {
        const event = new Event("click", { bubbles: true })
        element.dispatchEvent(event);
        await sleep(500);
    }
    while (document.getElementById("latestNfts") == null) {
        if (wait > 200) return location.reload();
        wait++;
        await sleep(50)
    };
    while (document.getElementById("latestNfts").querySelectorAll(`.col-6.item-filter[data-price="${price}"]`) == null) await sleep(50);
    while (document.getElementById("latestNfts").querySelectorAll(`.col-6.item-filter`).length == 0) await sleep(50);
    const available = document.getElementById("latestNfts").querySelectorAll(`.col-6.item-filter[data-price="${price}"]`);
    console.log(available);
    if (available.length == 0) {
        setTimeout(() => location.reload(), delayTime);
    } else {
        priceFilter(price, `${price} USDT`);
        await sleep(1000);
        while (available[0].querySelector(".bg-nft") == null) await sleep(50);
        click(available[0].querySelector(".bg-nft"));
        while (document.getElementById("modalDetailsNfts").querySelector("button") == null) await sleep(50);
        click(document.getElementById("modalDetailsNfts").querySelector("button"));
    }
})();
