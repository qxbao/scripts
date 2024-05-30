// ==UserScript==
// @name         AUTOnfa
// @namespace    http://tampermonkey.net/
// @version      1.3.1
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
    const clickAirdrops = (counter) => {
        console.log(`AUTOnfa debugger: Click at ${new Date().toLocaleTimeString()} (${counter})`);
        if ($("#claimnow").prop("disabled"))
            console.log("AUTOnfa debugger: Airdrop not available.");
        else {
            $("#claimnow").click();
            console.log("AUTOnfa debugger: Airdrop looted.");
        }
        return counter + 1;
    }
    const resting = 5000;
    let counter = 1;
    $(document).ready(async () => {
        console.log("AUTOnfa debugger: Start.");
        console.log("AUTOnfa debugger: Initializing...");
        const miners = [];
        const initPromise = new Promise((res) => {
            const initerval = setInterval(() => {
                if ($(".pageTitle")[0].textContent.trim() == "Airdrops") {
                    console.log("AUTOnfa debugger: Init successfully.");
                    clearInterval(initerval);
                    res("Airdrops");
                } else {
                    console.log("AUTOnfa debugger: Looking for miners data...");
                    const minersText = $(".detail div strong");
                    for (const minerText of minersText) {
                        miners.push(minerText.textContent.split("#")[1].trim());
                    }
                    if (miners.length > 0) {
                        console.log("AUTOnfa debugger: Init successfully.");
                        clearInterval(initerval);
                        res("Mining");
                    } else {
                        console.log("AUTOnfa debugger: Init failed.");
                    }
                }
            }, 1000);
        })
        const mode = await initPromise;
        mode == "Mining" ? console.log("AUTOnfa debugger: Miners(" + miners.length +") = " + miners.map(e => "#" + e).join(" ")) : null;
        const cycle = setInterval(() => {
            if (mode == "Mining")
                counter = clickMiners(miners, counter);
            else
                counter = clickAirdrops(counter);
        }, resting);
    })
})();
