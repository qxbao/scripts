// ==UserScript==
// @name         AUTOnfa
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Click click click
// @author       Orca
// @match        https://onfa.io/ecosystem/*
// @require      https://code.jquery.com/jquery-3.6.3.min.js
// @require      https://raw.githubusercontent.com/jeresig/jquery.hotkeys/master/jquery.hotkeys.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=onfa.io
// @downloadURL  https://raw.githubusercontent.com/qxbao/scripts/main/autonfa.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const clicking = (miners) => {
        for (const miner of miners) {
            $("#buttonMine" + miner).click();
        }
    }
    const gap = 5000;
    $(document).ready(() => {
        const cycle = setInterval(() => {
            const miners = [];
            const minersText = $(".detail div strong");
            for (const minerText of minersText) {
                miners.push(minerText.textContent.split("#")[1].trim());
            }
            console.log(miners);
            if (miners.length != 0) {
                clicking(miners);
            }
        }, gap);
    })
})();

