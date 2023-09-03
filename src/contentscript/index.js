"use strict";
import { insertSummaryBtn } from "./youtube";
let oldHref = "";
let apikey = "";

window.onload = async () => {
    if (window.location.hostname === "www.youtube.com") {
        if (window.location.search !== "" && window.location.search.includes("v=")) {
            // 执行插件
            insertSummaryBtn(apikey);
        }
        const bodyList = document.querySelector("body");
        let observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (oldHref !== document.location.href) {
                    oldHref = document.location.href;
                    insertSummaryBtn(apikey);
                }
            });
        });   
        observer.observe(bodyList, { childList: true, subtree: true });    
    }
}

