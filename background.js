"use strict";
const onInstallURL = "https://www.hercules.ink/";
chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason === "install") {
        // 安装成功后Chrome打开Hercules官网
        chrome.tabs.create({ url: onInstallURL });
    }
});



  