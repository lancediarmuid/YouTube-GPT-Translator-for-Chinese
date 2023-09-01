"use strict";

console.log("连接中 connected...");
const onInstallURL = "https://youtube.com";

// Chrome 插件按照成功过后，打开一个新的页面
chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason === "install") {
        chrome.tabs.create({ url: onInstallURL });
    }
});

let prompt = "";

// On Message
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log("background.js: onMessage", request);
});