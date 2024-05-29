// ==UserScript==
// @name         AUTOnfa
// @namespace    http://tampermonkey.net/
// @version      1.0
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
    const miners = [24714, 24713];
    const clicking = () => {
        for (const miner of miners) {
            $("#buttonMine" + miner).click();
        }
    }
    const gap = 20000;
    $(document).ready(() => {
        const cycle = setInterval(() => {
            clicking();
        }, gap);
    })
})();
