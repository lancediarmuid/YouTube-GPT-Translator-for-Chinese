"use strict";

import { getLangOptionsWithLink, getTranscriptHTML } from "./transcript";
import { getSearchParam,noTranscriptionAlert,createLangSelectBtns,fetchGPT} from "./utils";
import { ui,loading } from "./ui";
import { waitForElm } from "./dom";
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
        // 注入插件UI
        document.querySelector("#secondary.style-scope.ytd-watch-flexy").insertAdjacentHTML("afterbegin", ui);
        // 事件监听
        Array.from(document.getElementsByClassName("yt-summary-hover-el")).forEach(el => {
            const label = el.getAttribute("data-hover-label");
            if (!label) { return; }
            el.addEventListener("mouseenter", (e) => {
                e.stopPropagation();
                e.preventDefault();
                Array.from(document.getElementsByClassName("yt_ai_summary_header_hover_label")).forEach(el => { el.remove(); })
                el.insertAdjacentHTML("beforeend", 
                    `<div class="yt_ai_summary_header_hover_label">
                        ${label.replace(/\n+/g, `<br />`)}
                    </div>`
                );
            })
            el.addEventListener("mouseleave", (e) => {
                e.stopPropagation();
                e.preventDefault();
                Array.from(document.getElementsByClassName("yt_ai_summary_header_hover_label")).forEach(el => { el.remove(); })
            })
        })

        // 1.展开/收起小部件
        document.querySelector("#yt_ai_summary_header").addEventListener("click", async (e) => {
            // 获取视频ID
            const videoId = getSearchParam(window.location.href).v;
            // 对组件进行清理
            sanitizeWidget();
            // 如果小部件已经打开，则直接返回
            if (!isWidgetOpen()) { return; }
            // 获取语言选项的字幕链接
            const langOptionsWithLink = await getLangOptionsWithLink(videoId);
            // 没有字幕则提示用户
            if (!langOptionsWithLink) {
                noTranscriptionAlert();
                return;
            }
            // 生成语言选择按钮
            createLangSelectBtns(langOptionsWithLink);
            const transcriptHTML = await getTranscriptHTML(langOptionsWithLink[0].link, videoId);
            document.querySelector("#yt_ai_summary_text").innerHTML = transcriptHTML;
            // 语言切换按钮的监听
            evtListenerOnLangBtns(langOptionsWithLink, videoId);
            // 监听时间戳
            evtListenerOnTimestamp();
            // 监听文本
            evtListenerOnText();
        })
        setInterval(scrollIntoCurrTimeDiv, 1000);
    });

}

function sanitizeWidget() {
    // 清空转录区域
    document.querySelector("#yt_ai_summary_lang_select").innerHTML = "";
    // 清空总结区域
    document.querySelector("#yt_ai_summary_text").innerHTML = "";

    // 调整高度
    document.querySelector("#yt_ai_summary_body").style.maxHeight = window.innerHeight - 160 + "px";
    // 总结区域出现加载动画
    document.querySelector("#yt_ai_summary_text").innerHTML = loading;

    // 切换类列表
    document.querySelector("#yt_ai_summary_body").classList.toggle("yt_ai_summary_body_show");
    document.querySelector("#yt_ai_summary_header_toggle").classList.toggle("yt_ai_summary_header_toggle_rotate");
}

// 检查小部件是否打开
function isWidgetOpen() {
    return document.querySelector("#yt_ai_summary_body").classList.contains("yt_ai_summary_body_show");
}

// 在语言按钮上设置事件监听器
function evtListenerOnLangBtns(langOptionsWithLink, videoId) {
    let langs = Array.from(document.getElementsByClassName("yt_ai_summary_lang"))
    langs.forEach((langBtn) => {
        langBtn.addEventListener("click", async (e) => {
            const lang = e.target.getAttribute("data-yt-transcript-lang");
            const targetBtn = document.querySelector(`.yt_ai_summary_lang[data-yt-transcript-lang="${lang}"]`);
            const link = langOptionsWithLink.find((langOption) => langOption.language === lang).link;
            // 获取字幕的HTML内容以及设置事件监听器
            const transcriptHTML = await getTranscriptHTML(link, videoId);
            // 将字幕的HTML内容添加到整个字幕区域
            document.querySelector("#yt_ai_summary_text").innerHTML = transcriptHTML;
            // 执行时间戳监听，确保不同的语言在切换的过程中保持字幕一致性
            evtListenerOnTimestamp();
            // 添加选中状态类，并移除其他按钮的选中状态类

            // 修改选中状态的class样式
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

// 字幕实时滚动
function scrollIntoCurrTimeDiv() {
    const currTime = getTYCurrentTime();
    Array.from(document.getElementsByClassName("yt_ai_summary_transcript_text")).forEach(async (el, i, arr) => {
        const startTimeOfEl = el.getAttribute("data-start-time");
        // 获取下一个字幕元素的开始时间
        const startTimeOfNextEl = (i === arr.length-1) ? getTYEndTime() : arr[i+1].getAttribute("data-start-time") ?? 0;
        // 检查当前时间是否在当前字幕元素的时间范围内
        if (currTime >= startTimeOfEl && currTime < startTimeOfNextEl) {
            // 获取当前元素的位置信息
            const boundingRect = el.getBoundingClientRect();
            // 若当前元素已在可见区域内，则不进行滚动操作
            if (boundingRect.top >= 0 && boundingRect.bottom <= window.innerHeight) {
                return; 
            }
            // 将当前字幕和相应容器滚动到可见区域
            el.scrollIntoView({ behavior: 'auto', block: 'start' });
            let container = document.querySelector("#secondary > div.yt_ai_summary_container")
            container.scrollIntoView({ behavior: 'auto', block: 'end' });
            let text = el.innerText;
            
     
            let translation = await fetchGPT(text);
            el.innerHTML = translation
        }
    })
}

// 在时间戳上设置事件监听器，点击时间戳可以跳转到对应时间点播放视频
function evtListenerOnTimestamp() {
    let text_timestamp = Array.from(document.getElementsByClassName("yt_ai_summary_transcript_text_timestamp"))
    text_timestamp.forEach(el => {
        el.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            const starttime = el.getAttribute("data-start-time");
            // 获取视频元素
            const ytVideoEl = document.querySelector("#movie_player > div.html5-video-container > video");
            // 跳转到指定时间点播放视频
            ytVideoEl.currentTime = starttime;
            ytVideoEl.play();
        })
    })
}


// 监听文本
function evtListenerOnText() {
    let texts = Array.from(document.getElementsByClassName("yt_ai_summary_transcript_text"));
  
    texts.forEach(el => {
      el.addEventListener('mouseover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        el.classList.add('hover');
      });
      el.addEventListener('mouseout', (e) => {
        e.preventDefault();
        e.stopPropagation();
        el.classList.remove('hover');
      });
      el.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const ytVideoEl = document.querySelector("#movie_player > div.html5-video-container > video");
        if (ytVideoEl.paused) {
            // 如果视频已经暂停，则执行播放
            ytVideoEl.play();
          } else {
            // 如果视频正在播放，则执行暂停
            ytVideoEl.pause();
          }
      });
    });
  }
  
