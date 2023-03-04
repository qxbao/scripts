// ==UserScript==
// @name         Why Hello?
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Skip all Hello assessments
// @author       Orca
// @match        https://hello.hanu.edu.vn/web/mod/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hanu.edu.vn
// @require      https://code.jquery.com/jquery-3.6.3.min.js
// @downloadURL  https://raw.githubusercontent.com/qxbao/scripts/main/whyhello.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let counter = 0;
    let time = 2500;
    $(document).ready(() => {
    let cycle = setInterval(() => {
        counter++;
        if (counter > 3) clearInterval(cycle);
        if($("#mod_quiz-next-nav").length) {
            $("#mod_quiz-next-nav").click();
        }else if($('input[value="Submit all and finish"]').length){
            $('input[value="Submit all and finish"]').click();
        }else if($('.controls').eq(1).find('button').length || $('.quizstartbuttondiv form button').length){
            $('.quizstartbuttondiv form button').click();
            $('.controls').eq(1).find('button').click();
        }else if ($('#next-activity-link').length) {
            $('#next-activity-link').get(0).click();
        }else {
            document.title = "!!!!!!!!!!!!!!";
        }
    }, time)
})
// Changelog:
// 1.1: Fix some minor bugs
// 1.2: Click limit to 3 to avoid crash and add cycle-controller
// 1.3: WhyHello turn into a private tool
})();
