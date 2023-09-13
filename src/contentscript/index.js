"use strict";
import { insertSummaryBtn } from "./youtube";
let oldHref = "";

window.onload = async () => {
    if (window.location.hostname === "www.youtube.com") {
        if (window.location.search !== "" && window.location.search.includes("v=")) {
            // 执行插件
            insertSummaryBtn();
        }
        // 监听url变化
        const bodyList = document.querySelector("body");
        let observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (oldHref !== document.location.href) {
                    console.log("url change");
                    oldHref = document.location.href;
                    insertSummaryBtn();
                }
            });
        });   
        observer.observe(bodyList, { childList: true, subtree: true });    
    }
}

