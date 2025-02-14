// ==UserScript==
// @name         Ame Crawler
// @namespace    http://tampermonkey.net/
// @version      2025-02-14
// @description  try to take over the world!
// @author       Orca
// @match        https://vn.ameglobal888.com/member
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ameglobal888.com
// @grant        none
// @run-at       document-end
// ==/UserScript==

(async function() {
    'use strict';
    // Your code here...
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    window.addEventListener("load", async () => {
        console.log("injected");
        const running = localStorage.getItem("running");
        if (running === null) localStorage.setItem("running", "false");
        if (running === "true") {
            await sleep(4000);
            const data = Array.from(document.querySelectorAll(".h4")).map(e => e.textContent);
            const user = Array.from(document.querySelector(".member-list").querySelectorAll("li")).map(e => e.querySelectorAll("span")[1].textContent);
            await fetch("http://localhost:8080/addData", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    diemthuong: data[0],
                    sodu: data[1],
                    tamtinh: data[2],
                    id: `${user[1]} ${user[0]} ${user[2]} ${user[3]}`
                })
            });
            const index = localStorage.getItem("index");
            const nextIndex = Number(index) + 1 < 10 ? "0" + (Number(index) + 1) : Number(index) + 1;
            const totalId = document.querySelector(".memHoverMenu").querySelectorAll("a").length;
            if (Number(index) < Number(totalId)) {
                localStorage.setItem("index", Number(index) + 1);
                __doPostBack(`ctl00$header$MemberLogin$ctl${nextIndex}`,'')
            } else {
                localStorage.setItem("running", "false");
                localStorage.setItem("index", "0");
                alert("Done");
            }
        }
    });
    window.addEventListener("keydown", async (e) => {
        if (e.shiftKey && e.code == "KeyS") {
            console.log("Started!");
            const data = Array.from(document.querySelectorAll(".h4")).map(e => e.textContent);
            const user = Array.from(document.querySelector(".member-list").querySelectorAll("li")).map(e => e.querySelectorAll("span")[1].textContent);
            await fetch("http://localhost:8080/addData", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    diemthuong: data[0],
                    sodu: data[1],
                    tamtinh: data[2],
                    id: `${user[1]} ${user[0]} ${user[2]} ${user[3]}`
                })
            });
            localStorage.setItem("index", 0);
            localStorage.setItem("running", "true");
            __doPostBack(`ctl00$header$MemberLogin$ctl00`,'')
        } else if (e.shiftKey && e.code == "KeyP") {
            console.log("Paused!");
            localStorage.setItem("running", "false");
        }
    });
})();
