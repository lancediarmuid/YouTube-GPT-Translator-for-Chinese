"use strict";

console.log("连接中 connected...");
const onInstallURL = "https://youtube.com";

// Chrome 插件按照成功过后，打开一个新的页面
chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason === "install") {
        chrome.tabs.create({ url: onInstallURL });
    }
});

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//     if (request.message === "setApikey") {
//         chrome.storage.sync.set({ apikey: request.apikey }, function() {
//             console.log("保存了apikey", request.apikey);
//         });
//     } else if (request.message === "getApikey") {
//         chrome.storage.sync.get("apikey", function(result) {
//             sendResponse({ apikey: result.apikey||'' });
//         });
//     }
// });