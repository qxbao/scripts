// ==UserScript==
// @name         AUTOnfa Airdrop
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automation for Onfa.io
// @author       Orca
// @match        https://onfa.io/ecosystem/airdrops
// @icon         https://www.google.com/s2/favicons?sz=64&domain=onfa.io
// @downloadURL  https://raw.githubusercontent.com/qxbao/scripts/main/airdrop-claimer.user.js
// @updateURL    https://raw.githubusercontent.com/qxbao/scripts/main/airdrop-claimer.user.js
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';
    const clickAirdrops = (counter) => {
        console.log(`AUTOnfa debugger: Click at ${new Date().toLocaleTimeString()} (${counter})`);
        if (document.querySelector("#claimnow").disabled)
            console.log("AUTOnfa debugger: Airdrop not available.");
        else {
            document.querySelector("#claimnow").click();
            console.log("AUTOnfa debugger: Airdrop looted.");
            setTimeout(() => {
                location.reload();
            }, 10000);
        }
        return counter + 1;
    }
    const resting = 5000;
    let counter = 1;
    window.addEventListener("load", async () => {
        console.log("AUTOnfa debugger: Start.");
        const cycle = setInterval(() => {
            counter = clickAirdrops(counter);
        }, resting);
    })
})();
