// ==UserScript==
// @name         AUTOnf4
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Automation for Onfa.io
// @author       Orca
// @match        https://onfa.io/ecosystem/mining
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @require      https://cdn.datatables.net/2.0.8/js/dataTables.min.js
// @require      https://raw.githubusercontent.com/jeresig/jquery.hotkeys/master/jquery.hotkeys.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=onfa.io
// @downloadURL  https://raw.githubusercontent.com/qxbao/scripts/main/autonf4.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const clickMiners = (miners, counter) => {
        console.log(`AUTOnfa debugger: Click at ${new Date().toLocaleTimeString()} (${counter})`);
        if (counter % 10 == 0) {
            console.log("AUTOnfa debugger: Reloading miners");
            $("#reloadListing")[0].click();
        }
        for (const miner of miners) {
            console.log($("#buttonMine" + miner).length == 0 ? `>> #${miner} not available` : `>> #${miner} done`);
            $("#buttonMine" + miner).click();
        }
        return counter + 1;
    }
    const dprint = (msg) => {
        console.log("AUTOnfa Debugger >> " + msg);
    }
    const resting = 1800000;
    let counter = 1;
    $(document).ready(async () => {
        dprint("Started")
        dprint("Initializing...");
        const miners = [];
        const initPromise = new Promise((res) => {
            const initerval = setInterval(() => {
                dprint("Looking for miners data...");
                const minersText = $(".detail div strong");
                for (const minerText of minersText) {
                    miners.push(minerText.textContent.split("#")[1].trim());
                }
                if (miners.length > 0) {
                    dprint("Init successfully.");
                    clearInterval(initerval);
                    res();
                } else {
                    dprint("Init failed.");
                    $("#reloadListing")[0].click();
                }
            }, 1000);
        })
        await initPromise;
        dprint("Miners(" + miners.length +") = " + miners.map(e => "#" + e).join(" "));
        const cycle = setInterval(() => {
            counter = clickMiners(miners, counter);
        }, resting);
    })
})();
