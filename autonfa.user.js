// ==UserScript==
// @name         AUTOnfa
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Automation for Onfa.io
// @author       Orca
// @match        https://onfa.io/*
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @require      https://cdn.datatables.net/2.0.8/js/dataTables.min.js
// @require      https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js
// @require      https://cdn.jsdelivr.net/npm/bootstrap-select@1.14.0-beta2/js/bootstrap-select.js
// @require      https://raw.githubusercontent.com/jeresig/jquery.hotkeys/master/jquery.hotkeys.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=onfa.io
// @downloadURL  https://raw.githubusercontent.com/qxbao/scripts/main/autonfa.user.js
// @updateURL    https://raw.githubusercontent.com/qxbao/scripts/main/autonfa.user.js
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(async function() {
    'use strict';
     // Các miners đang hoạt động
    let minersID = await GM_getValue("miners", null);
    // UserID
    const userid = await GM_getValue("uid", null);
    // Debugging printing
    const dprint = (msg) => {
        console.log("AUTOnfa Debugger >> " + msg);
    }
    const resting = 10000;
    let counter = 1;
    const mine = (id) => {
        $.post("/ecosystem/mining_start", {id : id, uid : userid, token : token}, (data) => {
            if (data.status)
                dprint("Miner #" + id + " claimed!!!");
            else
                dprint("Miner #" + id + " are not ready to be claimed.");
        }, "json");
    }
    const claimAirdrop = (counter) => {
        $.post("/ecosystem/airdrops_claim", {id : token}, (data) => {
            if (data.status == false && "login" in data)
                dprint("Something wrong happened in claiming airdrop process.");
            else if (data.status == false)
                dprint("Airdrop not available.");
            else
                dprint("Airdrop looted");
        }, "json");
    }
    $(document).bind('keydown', 'ctrl+y', () => {
        const miners = [];
        const minersText = $(".detail div strong");
        for (const minerText of minersText) {
            miners.push(parseInt(minerText.textContent.split("#")[1].trim()));
        }
        GM_setValue("miners", miners.join(" "));
        GM_setValue("uid", uid);
        alert(`Data saved:\nUID: ${uid}\nMiners: ${miners.join(" ")}`);
    });
    $(document).ready(async () => {
        dprint("Started")
        dprint("Initializing...");
        dprint("Token: " + token);
        if (userid == null) {
            noti_error("UID is missing");
            return dprint("UID is missing");
        }
        dprint("UID: " + userid);
        if (minersID == null) {
            noti_error("Miners are missing");
            return dprint("Miners are missing");
        }
        minersID = minersID.trim().split(" ").map(e => parseInt(e));
        dprint("Miners: " + minersID);
        const cycle = setInterval(() => {
            dprint("ATTEMPT " + counter + " ---------------------------");
            minersID.forEach(mine);
            if (counter % 3 == 0)
                claimAirdrop(counter);
            if (counter % 120 == 0)
                location.reload();
            counter++;
        }, resting);
    });
})();
