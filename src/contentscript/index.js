"use strict";
import { insertSummaryBtn } from "./youtube";
let oldHref = "";
let apikey = "";


chrome.action.onClicked.addListener((tab) => {
   alert('xxx')
   document.getElementById("submit").addEventListener("click", () => {
    let value = document.getElementById("input").value;
    apikey = value;
    alert("API已保存",value)
});
  });
window.onload = async () => {
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        console.log("request",request)
        // if (request.type === 'storeInput') {
        //     userInput = request.value;
        // }
    });
    if (window.location.hostname === "www.youtube.com") {
       
        // 判断是否为 YouTube 内容页面
        if (window.location.search !== "" && window.location.search.includes("v=")) {
            // 执行插件
            insertSummaryBtn(apikey);
        }
        // 监听页面变化，发生变化后重新执行插件
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