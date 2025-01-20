    // ==UserScript==
    // @name         AUTOnfa Stable
    // @namespace    http://tampermonkey.net/
    // @version      1.7.2
    // @description  Automation for Onfa.io
    // @author       Orca
    // @match        https://onfa.io/ecosystem/mining
    // @icon         https://www.google.com/s2/favicons?sz=64&domain=onfa.io
    // @grant        none
    // @run-at       document-end
    // ==/UserScript==

    (function() {
        setTimeout(() => location.reload(), 1800000);
        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        const click = (element) => {
            if (element == null) return false;
            const event = new Event("click", { bubbles: true })
            element.dispatchEvent(event);
        }
        const dprint = (msg) => {
            console.log("AUTOnfa Debugger >> " + msg);
        }
        const checkPayouts = async (miners) => {
            return new Promise((res) => {
                (async function(){
                    for (const miner of miners) {
                        showListPayout((miner).toString(),`Thợ mỏ #${miner}`);
                        while(document.querySelector("#modalListPayout").querySelector(".show_name_worker") == null) await sleep(100);
                        while(!document.querySelector("#modalListPayout").querySelector(".show_name_worker").textContent.endsWith(miner)) await sleep(100);
                        await sleep(3000);
                        const clickable = document.querySelector("#modalListPayout").querySelectorAll("a");
                        for (let i = clickable.length - 1; i >= 0; i--) {
                            click(clickable[i]);
                            await sleep(1000);
                        }
                        while(document.querySelector("#modalListPayout").style.display != "none") {
                            click(clickable[0]);
                            await sleep(1000);
                        }
                        dprint(`#${miner} scanned!`);
                    }
                    res(0);
                })();
            })
        }
        const clickMiners = (miners, counter) => {
            dprint(`Click at ${new Date().toLocaleTimeString()}\nAttempt ${counter}`);
            if (counter % 15 == 0) {
                dprint("AUTOnfa debugger: Reloading miners");
                click(document.getElementById("reloadListing"));
            }
            for (const miner of miners) {
                dprint(`#${miner} done!`);
                click(document.querySelector("#buttonClaim" + miner));
                click(document.querySelector("#buttonMine" + miner));
            }
            return counter + 1;
        }
        const resting = 15000;
        let counter = 1;
        window.addEventListener("load", async () => {
            dprint("Started")
            dprint("Initializing...");
            const miners = [];
            const initPromise = new Promise((res) => {
                const initerval = setInterval(() => {
                    dprint("Looking for miners data...");
                    const minersText = document.querySelectorAll(".detail div strong");
                    for (const minerText of minersText)
                        miners.push(minerText.textContent.split("#")[1].trim());
                    if (miners.length > 0) {
                        dprint("Init successfully.");
                        clearInterval(initerval);
                        res(null);
                    } else {
                        dprint("Init failed.");
                        click(document.getElementById("reloadListing"));
                    }
                }, 4000);
            })
            await initPromise;
            dprint("Miners(" + miners.length +") = " + miners.map(e => "#" + e).join(" "));
            while (true) {
                counter = clickMiners(miners, counter);
                if (counter % 10 == 0) await checkPayouts(miners);
                await sleep(resting);
            }
        })
    })();
