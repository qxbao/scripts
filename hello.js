// ==UserScript==
// @name         Why Hello?
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Skip all Hello assessments
// @author       Orca
// @match        https://hello.hanu.edu.vn/web/mod/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hanu.edu.vn
// @require      https://code.jquery.com/jquery-3.6.3.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $(document).ready(() => {
    setInterval(() => {
        if($("#mod_quiz-next-nav").length) {
            $("#mod_quiz-next-nav").click();
        }else if($('input[value="Submit all and finish"]').length){
            $('input[value="Submit all and finish"]').click();
        }else if($('.controls').eq(1).find('button').length){
			$('.quizstartbuttondiv form button').click();
			$('.controls').eq(1).find('button').click();
		}else if ($('#next-activity-link').length) {
			$('#next-activity-link').get(0).click();
		}
    }, 5000)
})
})();
