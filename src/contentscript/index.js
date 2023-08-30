"use strict";
// 使用严格模式，提高代码质量

import { insertSummaryBtn } from "./youtube";
// 导入youtube.js文件中的insertSummaryBtn函数

let oldHref = "";
// 初始化变量oldHref为空字符串

window.onload = async () => {
    // 在窗口加载完成后执行以下操作

    if (window.location.hostname === "www.youtube.com") {
        // 如果当前页面的主机名是"www.youtube.com"

        if (window.location.search !== "" && window.location.search.includes("v=")) {
            // 如果当前页面的URL查询参数不为空并且包含"v="的字符串
            insertSummaryBtn();
            // 调用insertSummaryBtn函数
        }

        const bodyList = document.querySelector("body");
        // 获取body元素
        let observer = new MutationObserver((mutations) => {
            // 创建一个MutationObserver对象，监听DOM树的变化
            mutations.forEach((mutation) => {
                // 对每个变化进行处理
                if (oldHref !== document.location.href) {
                    // 如果oldHref不等于当前页面的URL
                    oldHref = document.location.href;
                    // 更新oldHref为当前页面的URL
                    insertSummaryBtn();
                    // 调用insertSummaryBtn函数
                }
            });
        });
        observer.observe(bodyList, { childList: true, subtree: true });
        // 开始监听body元素的子元素变化

    }

    if (window.location.hostname === "chat.openai.com") {
        // 如果当前页面的主机名是"chat.openai.com"

        if (document.getElementsByTagName("textarea")[0]) {
            // 如果存在文本域元素

            document.getElementsByTagName("textarea")[0].focus();
            // 将第一个文本域元素设为焦点

            if (window.location.search === "?ref=glasp") {
                // 如果URL的查询参数是"?ref=glasp"
                
                chrome.runtime.sendMessage({ message: "getPrompt" }, (response) => {
                    // 向background.js发送消息，请求获取prompt
                    document.getElementsByTagName("textarea")[0].value = response.prompt;
                    // 将prompt赋值给第一个文本域元素的value属性
                    if (response.prompt !== "") {
                        // 如果prompt不为空
                        document.getElementsByTagName("textarea")[0].focus();
                        // 将第一个文本域元素设为焦点
                        document.getElementsByTagName("button")[document.getElementsByTagName("button").length-1].click();
                        // 触发最后一个按钮的点击事件
                    }
                });
            }
        }
    }
}