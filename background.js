"use strict";

console.log("连接中 connected...");
const onInstallURL = "https://www.hercules.ink/";

// Chrome 插件按照成功过后，打开一个新的页面
chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason === "install") {
        chrome.tabs.create({ url: onInstallURL });
    }
});

function onClickHandler(info, tab) {
    if (info.menuItemId === "myContextMenuId") {
      console.log("Selected Text: ", info.selectionText);
      span.innerHTML = info.selectionText;
      span.style.backgroundColor = "yellow";
      document.body.appendChild(span);
    }
}
  