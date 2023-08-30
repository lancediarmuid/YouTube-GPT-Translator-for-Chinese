"use strict";

import { getLangOptionsWithLink, getTranscriptHTML } from "./transcript";
import { getSearchParam } from "./searchParam";
import { getChunckedTranscripts, getSummaryPrompt } from "./prompt";
import { copyTextToClipboard } from "./copy";

// 插入小部件按钮
export function insertSummaryBtn() {

    // 清空小部件
    if (document.querySelector("#yt_ai_summary_lang_select")) { document.querySelector("#yt_ai_summary_lang_select").innerHTML = ""; }
    if (document.querySelector("#yt_ai_summary_summary")) { document.querySelector("#yt_ai_summary_summary").innerHTML = ""; }
    Array.from(document.getElementsByClassName("yt_ai_summary_container")).forEach(el => { el.remove(); });

    if (!getSearchParam(window.location.href).v) { return; }

    waitForElm('#secondary.style-scope.ytd-watch-flexy').then(() => {

        // Sanitize
        Array.from(document.getElementsByClassName("yt_ai_summary_container")).forEach(el => { el.remove(); });

        // Place Script Div
        document.querySelector("#secondary.style-scope.ytd-watch-flexy").insertAdjacentHTML("afterbegin", `
        <div class="yt_ai_summary_container">
            <div id="yt_ai_summary_header" class="yt_ai_summary_header">
                <a href="#" target="_blank" style="width: 24px;height: 24px;">
                <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                width="28.000000pt" height="28.000000pt" viewBox="0 0 28.000000 28.000000"
                preserveAspectRatio="xMidYMid meet">
               
               <g transform="translate(0.000000,28.000000) scale(0.100000,-0.100000)"
               fill="#ff0000" stroke="none">
               <path d="M212 448 c-26 -16 -31 -17 -26 -4 9 23 -2 20 -57 -14 -68 -41 -90
               -65 -75 -80 8 -9 4 -17 -19 -36 -17 -14 -22 -22 -12 -18 9 3 17 1 17 -5 0 -6
               -4 -11 -10 -11 -5 0 -10 -8 -10 -18 0 -10 -5 -23 -11 -29 -9 -9 -7 -10 10 -6
               27 7 27 -10 -1 -38 l-23 -23 28 18 c41 25 57 14 19 -13 -34 -24 -45 -49 -14
               -32 12 6 23 5 37 -5 20 -15 20 -15 -5 -35 -24 -20 -24 -20 -2 -9 30 15 42 4
               16 -15 -18 -13 -18 -14 3 -8 14 3 23 1 23 -6 0 -8 9 -7 28 3 23 12 30 12 47 0
               18 -13 18 -15 1 -27 -16 -12 -13 -13 23 -11 23 1 45 4 48 8 3 3 11 2 17 -3 15
               -12 117 46 123 69 3 10 16 23 29 30 27 15 32 40 9 40 -21 0 -19 18 4 32 10 6
               17 17 14 24 -2 7 5 19 16 26 28 17 29 43 2 28 -13 -7 -22 -7 -26 0 -3 6 0 13
               9 16 8 3 14 14 13 25 -1 22 -2 22 -28 9 -20 -11 -26 -1 -9 16 7 7 1 9 -20 6
               -37 -5 -39 10 -5 28 15 8 22 17 16 23 -5 5 -19 2 -35 -8 -15 -10 -30 -14 -34
               -11 -7 7 4 17 45 42 15 10 14 11 -10 7 -17 -4 -34 0 -45 10 -16 15 -20 15 -47
               -3 -17 -11 -33 -20 -37 -20 -13 0 -9 38 5 43 6 3 8 5 2 5 -5 0 -25 -9 -43 -20z
               m106 -150 c7 -7 12 -33 12 -58 0 -25 -5 -51 -12 -58 -16 -16 -150 -16 -166 0
               -19 19 -15 105 6 117 24 15 145 14 160 -1z"/>
               <path d="M220 240 c0 -18 3 -19 21 -9 17 9 19 13 8 20 -22 14 -29 11 -29 -11z"/>
               <path d="M29 113 c-13 -15 -12 -15 9 -4 23 12 28 21 13 21 -5 0 -15 -7 -22
               -17z"/>
               </g>
               </svg>
                </a>
                <p class="yt_ai_summary_header_text">AI智能翻译插件</p>
                <div class="yt_ai_summary_header_actions">
               
                    <div id="yt_ai_summary_header_track" 
                    class="yt_ai_summary_header_action_btn yt-summary-hover-el"
                     data-hover-label="Jump to Current Time">
                        <svg style="filter: brightness(0.9);" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="6.25" stroke="#828282" stroke-width="1.5"/>
                            <rect x="3.19995" y="11.3999" width="5" height="1.2" rx="0.6" fill="#828282"/>
                            <rect x="15.7" y="11.3999" width="5" height="1.2" rx="0.6" fill="#828282"/>
                            <rect x="11.3999" y="8" width="5" height="1.2" rx="0.6" transform="rotate(-90 11.3999 8)" fill="#828282"/>
                            <rect x="11.3999" y="21" width="5" height="1.2" rx="0.6" transform="rotate(-90 11.3999 21)" fill="#828282"/>
                        </svg>
                    </div>
                    <div id="yt_ai_summary_header_copy" class="yt_ai_summary_header_action_btn yt-summary-hover-el" data-hover-label="Copy Transcript\n(Plain Text)">
                        <svg style="filter: brightness(0.95);" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 6.6V5C7 4.44772 7.44772 4 8 4H18C18.5523 4 19 4.44772 19 5V16C19 16.5523 18.5523 17 18 17H16.2308" stroke="#828282" stroke-width="1.5"/>
                            <rect x="4.75" y="6.75" width="11.5" height="13.5" rx="1.25" stroke="#828282" stroke-width="1.5"/>
                        </svg>
                    </div>
                    <div style="filter: brightness(0.9);" id="yt_ai_summary_header_toggle" class="yt_ai_summary_header_action_btn">
                        <svg width="24" height="24" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.2447 9.9588C16.5376 9.6659 16.5376 9.19103 16.2447 8.89814C15.9518 8.60524 15.4769 8.60524 15.184 8.89814L16.2447 9.9588ZM6.81611 8.89814C6.52322 8.60524 6.04835 8.60524 5.75545 8.89814C5.46256 9.19103 5.46256 9.6659 5.75545 9.9588L6.81611 8.89814ZM11.7425 14.461L16.2447 9.9588L15.184 8.89814L10.6819 13.4003L11.7425 14.461ZM11.3183 13.4003L6.81611 8.89814L5.75545 9.9588L10.2576 14.461L11.3183 13.4003ZM10.6819 13.4003C10.8576 13.2246 11.1425 13.2246 11.3183 13.4003L10.2576 14.461C10.6677 14.871 11.3325 14.871 11.7425 14.461L10.6819 13.4003Z" fill="#8B8B8B"/>
                        </svg>
                    </div>
                </div>
            </div>
            <div id="yt_ai_summary_body" class="yt_ai_summary_body">
                <div id="yt_ai_summary_lang_select" class="yt_ai_summary_lang_select"></div>
                <div id="yt_ai_summary_text" class="yt_ai_summary_text"></div>
            </div>
        </div>`);

        // Event Listener: Hover Label
        Array.from(document.getElementsByClassName("yt-summary-hover-el")).forEach(el => {
            const label = el.getAttribute("data-hover-label");
            if (!label) { return; }
            el.addEventListener("mouseenter", (e) => {
                e.stopPropagation();
                e.preventDefault();
                Array.from(document.getElementsByClassName("yt_ai_summary_header_hover_label")).forEach(el => { el.remove(); })
                el.insertAdjacentHTML("beforeend", `<div class="yt_ai_summary_header_hover_label">${label.replace(/\n+/g, `<br />`)}</div>`);
            })
            el.addEventListener("mouseleave", (e) => {
                e.stopPropagation();
                e.preventDefault();
                Array.from(document.getElementsByClassName("yt_ai_summary_header_hover_label")).forEach(el => { el.remove(); })
            })
        })

        // Event Listener: Copy Transcript
        document.querySelector("#yt_ai_summary_header_copy").addEventListener("click", (e) => {
            e.stopPropagation();
            const videoId = getSearchParam(window.location.href).v;
            copyTranscript(videoId);
        })

        // Event Listener: AI Summary
        // document.querySelector("#yt_ai_summary_header_summary").addEventListener("click", (e) => {
        //     e.stopPropagation();
        //     const prompt = copyTranscriptAndPrompt();
        //     setTimeout(() => {
        //         chrome.runtime.sendMessage({ message: "setPrompt", prompt: prompt });
        //         window.open("https://chat.openai.com/chat?ref=glasp", "_blank");
        //     }, 500);
        // })

        setInterval(scrollIntoCurrTimeDiv, 1000);

        // 定位到当前时间点
        document.querySelector("#yt_ai_summary_header_track").addEventListener("click", (e) => {
            e.stopPropagation();
            scrollIntoCurrTimeDiv();
        })

        // Event Listener: Toggle Transcript Body
        document.querySelector("#yt_ai_summary_header").addEventListener("click", async (e) => {

            const videoId = getSearchParam(window.location.href).v;
            sanitizeWidget();

            if (!isWidgetOpen()) { return; }

            // Get Transcript Language Options & Create Language Select Btns
            const langOptionsWithLink = await getLangOptionsWithLink(videoId);
            if (!langOptionsWithLink) {
                noTranscriptionAlert();
                return;
            }
            createLangSelectBtns(langOptionsWithLink);

            // Create Transcript HTML & Add Event Listener
            const transcriptHTML = await getTranscriptHTML(langOptionsWithLink[0].link, videoId);
            document.querySelector("#yt_ai_summary_text").innerHTML = transcriptHTML;
            evtListenerOnTimestamp();

            // Event Listener: Language Select Btn Click
            evtListenerOnLangBtns(langOptionsWithLink, videoId);

        })

    });

}

function sanitizeWidget() {
    // 清空转录区域
    document.querySelector("#yt_ai_summary_lang_select").innerHTML = "";
    document.querySelector("#yt_ai_summary_text").innerHTML = "";

    // 调整高度
    document.querySelector("#yt_ai_summary_body").style.maxHeight = window.innerHeight - 160 + "px";
    document.querySelector("#yt_ai_summary_text").innerHTML = `
    <svg class="yt_ai_summary_loading" style="display: block;width: 48px;margin: 40px auto;" width="48" height="48" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 36C59.9995 36 37 66 37 99C37 132 61.9995 163.5 100 163.5C138 163.5 164 132 164 99" stroke="#5C94FF" stroke-width="6"/>
    </svg>`;

    // 切换类列表
    document.querySelector("#yt_ai_summary_body").classList.toggle("yt_ai_summary_body_show");
    document.querySelector("#yt_ai_summary_header_copy").classList.toggle("yt_ai_summary_header_icon_show");
    // document.querySelector("#yt_ai_summary_header_summary").classList.toggle("yt_ai_summary_header_icon_show");
    document.querySelector("#yt_ai_summary_header_track").classList.toggle("yt_ai_summary_header_icon_show");
    document.querySelector("#yt_ai_summary_header_toggle").classList.toggle("yt_ai_summary_header_toggle_rotate");
}

function isWidgetOpen() {
    // 检查小部件是否打开
    return document.querySelector("#yt_ai_summary_body").classList.contains("yt_ai_summary_body_show");
}

function noTranscriptionAlert() {
    // 显示无转录提示
    document.querySelector("#yt_ai_summary_text").innerHTML = `
        <div style="margin: 40px auto;text-align: center;">
            <p>No Transcription Available... 😢</p>
            <p>Try <a href="https://huggingface.co/spaces/jeffistyping/Youtube-Whisperer" target="_blank">Huggingface Youtube Whisperer</a> to transcribe!</p>
        </div>
    `;
}

// 创建语言选择按钮
function createLangSelectBtns(langOptionsWithLink) {
    // 清空语言选择容器
    document.querySelector("#yt_ai_summary_lang_select").innerHTML = Array.from(langOptionsWithLink).map((langOption, index) => {
        // 生成每个语言选项的HTML代码
        return `<button class="yt_ai_summary_lang ${(index == 0) ? "yt_ai_summary_lange_selected" : ""}" data-yt-transcript-lang="${langOption.language}">${langOption.language}</button>`;
    }).join("");
}

// 在语言按钮上设置事件监听器
function evtListenerOnLangBtns(langOptionsWithLink, videoId) {
    Array.from(document.getElementsByClassName("yt_ai_summary_lang")).forEach((langBtn) => {
        langBtn.addEventListener("click", async (e) => {
            const lang = e.target.getAttribute("data-yt-transcript-lang");
            const targetBtn = document.querySelector(`.yt_ai_summary_lang[data-yt-transcript-lang="${lang}"]`);
            const link = langOptionsWithLink.find((langOption) => langOption.language === lang).link;
            // 获取字幕的HTML内容以及设置事件监听器
            const transcriptHTML = await getTranscriptHTML(link, videoId);
            document.querySelector("#yt_ai_summary_text").innerHTML = transcriptHTML;
            evtListenerOnTimestamp();
            // 添加选中状态类，并移除其他按钮的选中状态类
            targetBtn.classList.add("yt_ai_summary_lange_selected");
            Array.from(document.getElementsByClassName("yt_ai_summary_lang")).forEach((langBtn) => {
                if (langBtn !== targetBtn) { 
                    langBtn.classList.remove("yt_ai_summary_lange_selected"); 
                }
            })
        })
    })
}

// 获取当前视频的播放时间
function getTYCurrentTime() {
    return document.querySelector("#movie_player > div.html5-video-container > video").currentTime ?? 0;
}

// 获取当前视频的总时长
function getTYEndTime() {
    return document.querySelector("#movie_player > div.html5-video-container > video").duration ?? 0;
}

// 滚动到当前时间对应的字幕位置
function scrollIntoCurrTimeDiv() {
    const currTime = getTYCurrentTime();
    Array.from(document.getElementsByClassName("yt_ai_summary_transcript_text_timestamp")).forEach((el, i, arr) => {
        const startTimeOfEl = el.getAttribute("data-start-time");
        const startTimeOfNextEl = (i === arr.length-1) ? getTYEndTime() : arr[i+1].getAttribute("data-start-time") ?? 0;
        if (currTime >= startTimeOfEl && currTime < startTimeOfNextEl) {
            // 检查当前字幕元素是否在可见区域内
            const boundingRect = el.getBoundingClientRect();
            if (boundingRect.top >= 0 && boundingRect.bottom <= window.innerHeight) {
                return; // 如果元素已在可见区域内则不进行滚动操作
            }
            // 将当前字幕和相应容器滚动到可见区域
            el.scrollIntoView({ behavior: 'auto', block: 'start' });
            document.querySelector("#secondary > div.yt_ai_summary_container").scrollIntoView({ behavior: 'auto', block: 'end' });
        }
    })
}


  

// 在时间戳上设置事件监听器，点击时间戳可以跳转到对应时间点播放视频
function evtListenerOnTimestamp() {
    Array.from(document.getElementsByClassName("yt_ai_summary_transcript_text_timestamp")).forEach(el => {
        el.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            const starttime = el.getAttribute("data-start-time");
            const ytVideoEl = document.querySelector("#movie_player > div.html5-video-container > video");
            ytVideoEl.currentTime = starttime;
            ytVideoEl.play();
        })
    })
}

// 复制视频的字幕文本
function copyTranscript(videoId) {
    let contentBody = "";
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    contentBody += `${document.title}\n`; // 获取当前页面的标题，并将其加入到contentBody中
    contentBody += `${url}\n\n`; // 将视频链接加入到contentBody中
    contentBody += `Transcript:\n`; // 在contentBody中加入"Transcript:"标识

    Array.from(document.getElementById("yt_ai_summary_text").children).forEach(el => { // 遍历transcript区域的每个子元素
        if (!el) { return; } // 如果当前元素为空，则跳过
        if (el.children.length < 2) { return; } // 如果当前元素的子元素数量小于2，则跳过
        const timestamp = el.querySelector(".yt_ai_summary_transcript_text_timestamp").innerText; // 获取时间戳
        const timestampHref = el.querySelector(".yt_ai_summary_transcript_text_timestamp").getAttribute("data-timestamp-href"); // 获取时间戳链接
        const text = el.querySelector(".yt_ai_summary_transcript_text").innerText; // 获取文本内容
        contentBody += `(${timestamp}) ${text}\n`; // 将时间戳和文本内容组合成一行，并加入到contentBody中
    })
  
    copyTextToClipboard(contentBody); // 将contentBody中的内容复制到剪贴板中
}

// 复制字幕文本并提示用户
function copyTranscriptAndPrompt() {
    const textEls = document.getElementsByClassName("yt_ai_summary_transcript_text"); // 获取所有的字幕文本元素
    const textData = Array.from(textEls).map((textEl, i) => { return { // 将字幕文本元素和索引封装成对象，存储到数组中
        text: textEl.textContent.trim(),
        index: i,
    }})
    
    const text = getChunckedTranscripts(textData, textData); // 调用函数获取分块的字幕文本
    const prompt = getSummaryPrompt(text); // 调用函数获取摘要提示文本
    copyTextToClipboard(prompt); // 将摘要提示文本复制到剪贴板中
    return prompt; // 返回摘要提示文本
}

// 等待页面元素加载完成
function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) { // 如果指定选择器的元素存在，则直接返回该元素
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => { // 创建一个MutationObserver实例监听DOM变化
            if (document.querySelector(selector)) { // 如果指定选择器的元素存在，则返回该元素
                resolve(document.querySelector(selector));
                observer.disconnect(); // 停止观察DOM变化
            }
        });

        observer.observe(document.body, { // 开始观察document.body元素的子节点和后代节点的变化
            childList: true,
            subtree: true
        });
    });
}
