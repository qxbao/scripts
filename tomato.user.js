// ==UserScript==
// @name         Tomato
// @namespace    http://tampermonkey.net/
// @version      2026-04-23
// @description  Lorem ipsum dolosit amet
// @author       qxbao
// @match        https://qldt.hanu.edu.vn/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const TARGET_IMG = "https://cdn.qxbao.dev/93828087-2266-4421-9142-2acbde5ba21b.jpg";
    const SELECTOR = ".profile-img > img, .avatar, .lb-image";

    const style = document.createElement('style');
    style.innerHTML = `
        ${SELECTOR} {
            content: url("${TARGET_IMG}") !important;
            visibility: visible !important;
            filter: none !important;
        }
    `;
    document.documentElement.appendChild(style);

    const handleImage = (img) => {
        if (img.src !== TARGET_IMG) {
            img.src = TARGET_IMG;
        }
    };

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === 1) {
                    if (node.matches(SELECTOR)) handleImage(node);
                    const nested = node.querySelectorAll(SELECTOR);
                    for (const img of nested) handleImage(img);
                }
            }
        }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
})();
