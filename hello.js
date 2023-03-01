// ==UserScript==
// @name         LiveAgent - Clickafy URLs
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Make the Central and Jira issue tracker IDs, the user ID, the user's website, and the sandbox site URL clickable in LiveAgent
// @author       Andras Guseo
// @include      https://support.theeventscalendar.com/agent/*
// @include      https://theeventscalendar.ladesk.com/agent/*
// @downloadURL  https://github.com/moderntribe/tampermonkey-scripts/raw/master/liveagent/liveagent-clickafy-urls.user.js
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
