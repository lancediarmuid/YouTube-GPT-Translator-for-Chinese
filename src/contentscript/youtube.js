"use strict";

import { getLangOptionsWithLink, getTranscriptHTML } from "./transcript";
import { getSearchParam,copyTextToClipboard,noTranscriptionAlert,createLangSelectBtns} from "./utils";
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

        /**
         * 按钮click事件监听
         */
   
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

        document.querySelector("#yt_ai_summary_header_copy").addEventListener("click", (e) => {
            e.stopPropagation();
            const videoId = getSearchParam(window.location.href).v;
            copyTranscript(videoId);
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
    document.querySelector("#yt_ai_summary_header_copy").classList.toggle("yt_ai_summary_header_icon_show");
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

const fetchGPT = async (text) => {
    let data = {
        model: 'gpt-3.5-turbo-16k-0613',
        template:  `You are a translator expert between Chinese and English, and the user is an elementary school student.
         Please underline and provide Chinese explanations for English words or phrases that the user may not understand.
         The embedded format should be as follows: <u>word</u>.`,
        question:text,
        temperature:  0.1,
        max_tokens: 5000,
        top_p: 1,
        frequency_penalty: 1,
        presence_penalty: 1.1,
      }
    try {
        const BACK_END = 'https://api.relai.social';
        const res = await fetch(`${BACK_END}/rest-api/llm/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        const json = await res.json();
        console.log(json)
        if (json.status_code === 200) {
           
          return json.data
        } else {
          return '\n【AI翻译服务器错误】'
        }
      } catch (e) {
        return '\n【AI翻译服务器错误】'
      }
}

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
  
      // 点击事件处理程序
      const clickHandler = async (e) => {
        e.preventDefault();
        e.stopPropagation();
  
        // 移除点击事件处理程序
        el.removeEventListener("click", clickHandler);
  
        let text = e.target.innerText;
        e.target.innerText = 'AI翻译中...';
        let translation = await fetchGPT(text);
        console.log(translation)
        e.target.innerHTML = translation
       
        // 重新启用点击事件处理程序（3秒后）
        setTimeout(() => {
          el.addEventListener("click", clickHandler);
        }, 3000);
      };
  
      // 添加点击事件处理程序
      el.addEventListener("click", clickHandler);
    });
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
// function copyTranscriptAndPrompt() {
//     const textEls = document.getElementsByClassName("yt_ai_summary_transcript_text"); // 获取所有的字幕文本元素
//     const textData = Array.from(textEls).map((textEl, i) => { return { // 将字幕文本元素和索引封装成对象，存储到数组中
//         text: textEl.textContent.trim(),
//         index: i,
//     }})
    
//     const text = getChunckedTranscripts(textData, textData); // 调用函数获取分块的字幕文本
//     const prompt = getSummaryPrompt(text); // 调用函数获取摘要提示文本
//     copyTextToClipboard(prompt); // 将摘要提示文本复制到剪贴板中
//     return prompt; // 返回摘要提示文本
// }


