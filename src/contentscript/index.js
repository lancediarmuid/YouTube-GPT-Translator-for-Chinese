"use strict";
import { insertSummaryBtn } from "./youtube";
let oldHref = "";
window.onload = async () => {
    if (window.location.hostname === "www.youtube.com") {
        // 判断是否为 YouTube 内容页面
        if (window.location.search !== "" && window.location.search.includes("v=")) {
            // 执行插件
            insertSummaryBtn();
        }
        // 监听页面变化，发生变化后重新执行插件
        const bodyList = document.querySelector("body");
        let observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (oldHref !== document.location.href) {
                    oldHref = document.location.href;
                    insertSummaryBtn();
                }
            });
        });
        observer.observe(bodyList, { childList: true, subtree: true });
    }
}