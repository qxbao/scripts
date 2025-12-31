// ==UserScript==
// @name         AUTOnfa Airdrop
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automation for Onfa.io
// @author       Orca
// @match        https://onfa.io/ecosystem/airdrops
// @icon         https://www.google.com/s2/favicons?sz=64&domain=onfa.io
// @downloadURL  https://raw.githubusercontent.com/qxbao/scripts/main/airdrop-claimer.user.js
// @updateURL    https://raw.githubusercontent.com/qxbao/scripts/main/airdrop-claimer.user.js
// @grant        none
// @run-at       document-end
// ==/UserScript==

(async function() {
    'use strict';

    const DEBUG = true;
    const TAG = "[AUTOnfa]";

    const log = (...args) => {
        if (DEBUG) console.log(TAG, ...args);
    };

    log("Script loaded");

    // Reload định kỳ mỗi 30 phút
    setTimeout(() => {
        log("Periodic reload triggered (30 mins)");
        location.reload();
    }, 1800 * 1000);

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const click = (element) => {
        if (!element) {
            log("Click skipped: element is null");
            return false;
        }
        const event = new Event("click", { bubbles: true });
        element.dispatchEvent(event);
        log("Clicked element:", element);
        return true;
    };

    const clickAirdrops = (counter) => {
        log("Scan airdrop cycle:", counter);

        const claimButtons = document.querySelectorAll(".claimnow");
        log("Found claim buttons:", claimButtons.length);

        if (claimButtons.length === 0) {
            log("No claim available");
            return counter + 1;
        }

        for (const button of claimButtons) {
            if (button.disabled) {
                log("Claim button exists but is disabled");
                continue;
            }

            log("Claiming airdrop");
            click(button);

            setTimeout(() => {
                log("Reload after claim");
                location.reload();
            }, 10000);

            break;
        }

        return counter + 1;
    };


    const resting = 5000;
    let counter = 1;

    window.addEventListener("load", () => {
        log("Page fully loaded, starting interval loop");

        setInterval(() => {
            counter = clickAirdrops(counter);
        }, resting);
    });
})();
