// ==UserScript==
// @name         AUTOnfa Stable
// @namespace    http://tampermonkey.net/
// @version      1.8.0
// @description  Automation for Onfa.io with
// @author       Orca
// @match        https://onfa.io/ecosystem/mining
// @icon         https://www.google.com/s2/favicons?sz=64&domain=onfa.io
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    // 1. Cấu hình Hệ số Tuyến tính (Linear Multipliers)
    const CYCLE_BASE_MIN = 3 * 60 * 1000;  // 3 phút
    const CYCLE_BASE_MAX = 7 * 60 * 1000;  // 7 phút
    
    const MULTIPLIER_PAYOUT = 10;          // Cứ 10 chu kỳ (~50 phút) check payout 1 lần
    const MULTIPLIER_RELOAD_LIST = 15;     // Cứ 15 chu kỳ (~75 phút) làm mới list 1 lần
    const MULTIPLIER_HARD_RELOAD = 30;     // Cứ 30 chu kỳ (~150 phút) hard F5 toàn trang

    const getJitter = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    const click = (element) => {
        if (element == null) return false;
        const event = new Event("click", { bubbles: true });
        element.dispatchEvent(event);
    }
    
    const dprint = (msg) => {
        console.log("AUTOnfa Debugger >> " + msg);
    }

    const checkPayouts = async (miners) => {
        dprint("Bắt đầu tiến trình kiểm tra Payout...");
        const modal = document.querySelector("#modalListPayout"); // DOM Caching: Giảm chi phí duyệt cây
        
        for (const miner of miners) {
            showListPayout((miner).toString(), `Thợ mỏ #${miner}`);
            
            // --- CIRCUIT BREAKER: Chống treo luồng vô hạn ---
            let retries = 0;
            const maxRetries = 40; // Tối đa thử 40 lần (~6 đến 10 giây)
            
            // Chờ phần tử DOM xuất hiện
            while(modal.querySelector(".show_name_worker") == null && retries < maxRetries) {
                await sleep(getJitter(150, 250));
                retries++;
            }
            if (retries >= maxRetries) {
                dprint(`[Ngắt mạch] Không tìm thấy UI cho #${miner}. Bỏ qua để bảo vệ luồng chính.`);
                continue; // Thoát khỏi miner hiện tại, đi tới miner tiếp theo
            }

            retries = 0; // Reset đếm cho chốt chặn thứ 2
            
            // Chờ Text Content khớp dữ liệu
            while(!modal.querySelector(".show_name_worker").textContent.endsWith(miner) && retries < maxRetries) {
                await sleep(getJitter(150, 250));
                retries++;
            }
            if (retries >= maxRetries) {
                dprint(`[Ngắt mạch] Dữ liệu #${miner} không đồng bộ. Bỏ qua để bảo vệ luồng chính.`);
                continue;
            }
            // ------------------------------------------------

            await sleep(getJitter(2500, 4000));
            
            const clickable = modal.querySelectorAll("a");
            for (let i = clickable.length - 1; i >= 0; i--) {
                click(clickable[i]);
                await sleep(getJitter(800, 1500));
            }
            
            // Circuit Breaker cho việc đóng Modal
            retries = 0;
            while(modal.style.display != "none" && retries < 20) {
                click(clickable[0]);
                await sleep(getJitter(800, 1500));
                retries++;
            }
            
            dprint(`#${miner} scanned!`);
        }
    }
    
    const clickMiners = (miners, counter) => {
        dprint(`\n--- Chu kỳ ${counter} | ${new Date().toLocaleTimeString()} ---`);
        for (const miner of miners) {
            click(document.querySelector("#buttonClaim" + miner));
            click(document.querySelector("#buttonMine" + miner));
        }
    }

    window.addEventListener("load", async () => {
        dprint("Đã khởi động. Chuẩn bị tiêm logic...");
        const miners = [];
        let counter = 1;

        const initPromise = new Promise((res) => {
            const initerval = setInterval(() => {
                dprint("Đang định vị dữ liệu thợ mỏ...");
                const minersText = document.querySelectorAll(".detail div strong");
                for (const minerText of minersText)
                    miners.push(minerText.textContent.split("#")[1].trim());
                
                if (miners.length > 0) {
                    dprint(`Init thành công. Đã khóa mục tiêu: ${miners.length} miners.`);
                    clearInterval(initerval);
                    res(null);
                } else {
                    click(document.getElementById("reloadListing"));
                }
            }, getJitter(3500, 4500));
        });

        await initPromise;
        
        // Vòng lặp vĩnh cửu - Quản lý Lifecycle tập trung
        while (true) {
            // 1. Phân tích định tuyến (Routing Logic)
            if (counter % MULTIPLIER_HARD_RELOAD === 0) {
                dprint("Đã đạt giới hạn định mệnh (Hard Reload). Khởi động lại toàn bộ trật tự...");
                location.reload(); // Kết thúc vòng đời
                break; // Cắt đứt hoàn toàn execution context hiện tại
            }
            
            if (counter % MULTIPLIER_RELOAD_LIST === 0) {
                dprint("Bảo trì danh sách thợ mỏ...");
                click(document.getElementById("reloadListing"));
                await sleep(getJitter(2000, 4000)); // Nghỉ một chút cho UI tải lại
            }

            if (counter % MULTIPLIER_PAYOUT === 0) {
                await checkPayouts(miners);
            }

            // 2. Thực thi Core Logic
            clickMiners(miners, counter);

            // 3. Tịnh tiến thời gian
            counter++;
            const restTime = getJitter(CYCLE_BASE_MIN, CYCLE_BASE_MAX);
            dprint(`Tiến vào trạng thái ngủ ngầm: ${(restTime / 60000).toFixed(2)} phút.`);
            await sleep(restTime);
        }
    });
})();
