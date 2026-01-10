// ==UserScript==
// @name         OHO Mining Claimer
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  Claim OHO Mining
// @author       You
// @match        https://onfa.io/oho_mining*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=onfa.io
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @updateURL    https://raw.githubusercontent.com/qxbao/scripts/main/oho-mining.user.js
// @downloadURL  https://raw.githubusercontent.com/qxbao/scripts/main/oho-mining.user.js
// ==/UserScript==

(async function() {
    'use strict';

    const DEBUG = true;
    const TAG = "[OHO]";

    setTimeout(() => location.reload(), 3600 * 1000 / 2)
    
    (function forceNoPopup() {
        const alwaysTrue = () => true;
        const noop = () => {};
    
        const override = (obj, name, value) => {
            try {
                Object.defineProperty(obj, name, {
                    value,
                    writable: false,
                    configurable: false
                });
            } catch (e) {
                // fallback nếu defineProperty fail
                obj[name] = value;
            }
        };
    
        // window context
        override(window, 'confirm', alwaysTrue);
        override(window, 'alert', noop);
        override(window, 'prompt', () => null);
    
        // unsafeWindow context (page JS thực sự chạy ở đây)
        if (typeof unsafeWindow !== "undefined") {
            override(unsafeWindow, 'confirm', alwaysTrue);
            override(unsafeWindow, 'alert', noop);
            override(unsafeWindow, 'prompt', () => null);
        }
    })();
    
    function log(...args) {
        if (DEBUG) console.log(TAG, ...args);
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    };

    function click(e) {
        if (e == null) {
            log("Click skipped: element is null");
            return false;
        }
        const event = new Event("click", { bubbles: true });
        e.dispatchEvent(event);
        log("Clicked element:", e);
    }

    // Logic start here
    const path = location.pathname;
    const RESET_INTERVAL_MAX = 10 * 60 * 60 * 1000; // 10hrs

    let claimedIds = GM_getValue("ids", []);
    let lastMine = GM_getValue("lm", 0);

    log("Script loaded");
    log("Path:", path);
    log("Claimed IDs:", claimedIds);
    log("Last mine timestamp:", lastMine);

    window.addEventListener("load", async () => {

        if (path === "/oho_mining/my_machines") {
            log("Entering my_machines scope");

            const claimButtons = document.getElementsByClassName("claim-btn");
            log("Found claim buttons:", claimButtons.length);

            const shouldReset =
                  claimedIds.length === claimButtons.length ||
                  (Date.now() - RESET_INTERVAL_MAX > lastMine);

            if (shouldReset) {
                log("Reset condition met. Resetting claimedIds.");
                claimedIds = [];
                GM_setValue("ids", claimedIds);
                lastMine = Date.now();
                GM_setValue("lm", lastMine);
            }

            for (const button of claimButtons) {
                const minerId = button.href.split("/").pop();

                if (claimedIds.includes(minerId)) {
                    log("Skip miner (already claimed):", minerId);
                    continue;
                }

                log("Claiming miner:", minerId);
                button.click();
            }

        } else if (path.startsWith("/oho_mining/mining_details/")) {
            log("Entering mining_details scope");

            await sleep(5000);

            const minerId = path.split("/").pop();
            log("Mining details for miner:", minerId);

            let mineButton = document.getElementsByClassName("action-btn");

            if (mineButton.length === 0) {
                log("No action button found");

                if (!claimedIds.includes(minerId)) {
                    claimedIds.push(minerId);
                    GM_setValue("ids", claimedIds);
                    log("Marked miner as claimed:", minerId);
                }

                const backBtn = document.getElementsByClassName("back-button")[0];
                log("Going back to machines page");
                backBtn && backBtn.click();
                return;
            }

            log("Click mining action button");
            click(mineButton[0]);

            await sleep(5000);
            mineButton = document.getElementsByClassName("action-btn");

            if (mineButton.length === 0 || mineButton[0].disabled) {
                log("Mining finished or button disabled");

                if (!claimedIds.includes(minerId)) {
                    claimedIds.push(minerId);
                    GM_setValue("ids", claimedIds);
                    log("Marked miner as claimed:", minerId);
                }

                const backBtn = document.getElementsByClassName("back-button")[0];
                log("Returning to machines page");
                backBtn && backBtn.click();

            } else {
                log("Mining still active, reloading page");
                location.reload();
            }
        }
    });
})();
