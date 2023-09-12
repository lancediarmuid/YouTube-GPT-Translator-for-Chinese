"use strict";

import { getLangOptionsWithLink, getTranscriptHTML } from "./transcript";
import { getSearchParam,noTranscriptionAlert,createLangSelectBtns,fetchGPT,
    containsChinese,
    fetchGPTKeywords,fetchGPTAnalysis,copyTranscript} from "./utils";
import { ui,loading } from "./ui";
import { waitForElm } from "./dom";
// 插入小部件按钮

const ytVideoEl = document.querySelector("#movie_player > div.html5-video-container > video");

export function insertSummaryBtn() {
    // 清空小部件
    if (document.querySelector("#yt_ai_summary_lang_select")) { document.querySelector("#yt_ai_summary_lang_select").innerHTML = ""; }
    if (document.querySelector("#yt_ai_summary_summary")) { document.querySelector("#yt_ai_summary_summary").innerHTML = ""; }
    Array.from(document.getElementsByClassName("hercules_container")).forEach(el => { el.remove(); });
    if (!getSearchParam(window.location.href).v) { return; }
    waitForElm('#secondary.style-scope.ytd-watch-flexy').then(() => {
        // Sanitize
        Array.from(document.getElementsByClassName("hercules_container")).forEach(el => { el.remove(); });
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
        
        async function init(){
                  // 对组件进行清理
                  sanitizeWidget();
                  // 如果小部件已经关闭，则直接返回
                  if (!isWidgetOpen()) { return; }
                  // 获取视频ID
                   const videoId = getSearchParam(window.location.href).v;
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
                  // 监听按钮
                  evtListenerOnBtn();
                  // 监听是否全屏
                  evtListenerOnScreen();
                  // 监听划词
                  evtListenerOnSelectText();
                  // 监听滚动
                  window.addEventListener('scroll', function() {
                      const ytVideoEl = document.querySelector("#movie_player > div.html5-video-container > video");
                      if (window.pageYOffset > 300) {
                          if (!ytVideoEl.paused) {
                              ytVideoEl.pause();
                          }
                      }else{ 
                          if (ytVideoEl.paused) {
                              ytVideoEl.play();
                          }
                      }
                  });
        }
        if (!isWidgetOpen()){
            init()
        }

        // 1.展开/收起小部件
        document.querySelector("#yt_ai_summary_header").addEventListener("click", async (e) => {
            init()
        })

        setInterval(function() {
            const ytVideoEl = document.querySelector("#movie_player > div.html5-video-container > video");
            if (!ytVideoEl.paused) {
                scrollIntoCurrTimeDiv();
            }
        }, 1000);

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

function sanitizeAiResult(startTime) {
    let grammaText = document.getElementById(`gramma-${startTime}`)
    let translation = document.getElementById(`translation-${startTime}`)
    let keywords = document.getElementById(`keywords-${startTime}`)
    if(grammaText){
        grammaText.remove()
    }    
    if(translation){
        translation.remove()
    }
    if(keywords){
        keywords.remove()
    }
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
async function scrollIntoCurrTimeDiv() {
    const currTime = getTYCurrentTime();
    Array.from(document.getElementsByClassName("yt_ai_summary_transcript_text")).forEach(async (el, i, arr) => {
        const startTimeOfEl = el.getAttribute("data-start-time");
        const startTimeOfNextEl = (i === arr.length-1) ? getTYEndTime() : arr[i+1].getAttribute("data-start-time") ?? 0;
        // 检查当前时间是否在当前字幕元素的时间范围内
        if (currTime >= startTimeOfEl && currTime < startTimeOfNextEl) {
            el.classList.add('hover'); 
            // 获取当前元素的位置信息
            const boundingRect = el.getBoundingClientRect();
            // // 若当前元素已在可见区域内，则不进行滚动操作
            if (boundingRect.top >= 0 && boundingRect.bottom <= window.innerHeight) {
                return; 
            }
            // 将当前字幕和相应容器滚动到可见区域
            el.scrollIntoView({ behavior: 'auto', block: 'start' });
     
            let container = document.querySelector("#secondary > div.hercules_container")
            container.scrollIntoView({ behavior: 'auto', block: 'end' });
        }else{
            el.classList.remove('hover');
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
            ytVideoEl.currentTime = starttime;
            ytVideoEl.play();   
        })
    })
}


// 监听文本
function evtListenerOnText() {
    let texts = Array.from(document.getElementsByClassName("yt_ai_summary_transcript_text"));
    texts.forEach(el => {
      el.addEventListener('click',async (e) => {
        e.preventDefault();
        e.stopPropagation();
        // const starttime = el.getAttribute("data-start-time");
        // ytVideoEl.currentTime = starttime;
        // ytVideoEl.play();
      });
    });
  }
// 监听划词
function evtListenerOnSelectText(){
    let textboard = document.getElementById('yt_ai_summary_text')
    textboard.addEventListener('mouseup', function(event) {
        event.preventDefault();
        event.stopPropagation();
        var selectedText = window.getSelection().toString().trim();
        var englishWords = selectedText.match(/\b\w+\b/g);
        if (englishWords) { 
            var selection = window.getSelection();
            if (!selection.rangeCount) return;
            var range = selection.getRangeAt(0);
            var newNode = document.createElement("span");
            if (range.toString().length > 0) {
                var selectedNode = range.startContainer.parentNode;
                if (selectedNode.style.backgroundColor === "yellow") {
                    selectedNode.removeAttribute("style"); // remove the style attribute
                    selectedNode.innerHTML = selectedNode.textContent; // revert to plain text
                } else {
                    newNode.style.backgroundColor = "yellow";
                    newNode.appendChild(range.extractContents());
                    range.insertNode(newNode);
                }
            }
        }   
        // var highlightedText = document.querySelectorAll('span[style="background-color: yellow;"]');
        // highlightedText.forEach(function(span) {
        //     span.style.backgroundColor = ''; // Remove the background color
        // });
        // if (englishWords) { 
        //     var popup = document.createElement("div");
        //     popup.innerHTML = `
        //         <div class="popup-option">词法解释</div>
        //         <div class="popup-option">撤销</div>
        //     `;
        //     popup.style.position = "absolute";
        //     popup.style.top = event.clientY + "px";
        //     popup.style.left = event.clientX + "px";
        //     popup.classList.add("popup-container");
        //     document.body.appendChild(popup);
        //     popup.addEventListener("click", function(e) {
        //         e.stopPropagation();
        //         e.preventDefault();
        //         var selectedOption = e.target.innerText;
        //         if (selectedOption === "划词注释") {
        //           console.log("执行划词操作");
        //         } else if (selectedOption === "词法解释") {
        //           console.log("执行解释操作");
        //         } else if (selectedOption === "撤销") {
        //             var isInsidePopup = e.target.closest(".popup-container");
        //             var isInsideSelectedText = e.target.closest("span");
        //             if (!isInsidePopup && !isInsideSelectedText) {
        //               var spans = document.querySelectorAll("span");
        //               spans.forEach(function(span) {
        //                 var parent = span.parentNode;
        //                 while (span.firstChild) {
        //                   parent.insertBefore(span.firstChild, span);
        //                 }
        //                 parent.removeChild(span);
        //               });
        //               var popup = document.querySelector(".popup-container");
        //               if (popup) {
        //                 document.body.removeChild(popup);
        //               }
        //             }
        //         }
        //         document.body.removeChild(popup);
        //     });
        // }
    });
}


function evtListenerOnBtn(){
    let translateList = document.querySelectorAll('.translate');
    let grammaList = document.querySelectorAll('.gramma');
    let keywordsList = document.querySelectorAll('.keywords');
    
    translateList.forEach((element) => {
      element.addEventListener('click', async function(e) {
        let startTime = this.getAttribute('data-start-time');
        e.preventDefault();
        e.stopPropagation();
    
        let text = document.getElementById('text-' + startTime).innerText;
        // 对于中文不进行翻译
        if(containsChinese(text)){
            console.log("包含中文",text)
            return;
        }
        // 清理上一次的翻译结果
        sanitizeAiResult(startTime);
        let el = document.getElementById('text-' + startTime);
        el.innerHTML += `<div class='loading'>${loading}<div>AI 翻译中....</div></div>`;
        ytVideoEl.pause()
        let translation = await fetchGPT(text);
        el.insertAdjacentHTML('afterend', `<div class='translation-text' id='translation-${startTime}'>${translation}</div>`);
        ytVideoEl.play()
        let loadingEl = el.querySelector('.loading');
        if (loadingEl) {
            loadingEl.remove(); 
        }
      });
    });
    
    grammaList.forEach((element) => {
        element.addEventListener('click', async function(e) {
            let startTime = this.getAttribute('data-start-time');
            e.preventDefault();
            e.stopPropagation();
            let text = document.getElementById('text-' + startTime).innerText;
            if(containsChinese(text)){
                console.log("包含中文",text)
                return;
            }
             // 清理上一次的翻译结果
            sanitizeAiResult(startTime);
            let el = document.getElementById('text-' + startTime);
            el.innerHTML += `<div class='loading'>${loading}<div>AI 分析中....</div></div>`;
            ytVideoEl.pause()
            let result = await fetchGPTAnalysis(text);
            el.insertAdjacentHTML('afterend', `<div class='gramma-text' id='gramma-${startTime}'>${result}</div>`);

            ytVideoEl.play()
            let loadingEl = el.querySelector('.loading');
            if (loadingEl) {
                loadingEl.remove(); 
            }
        });
    });

    keywordsList.forEach((element) => {
        element.addEventListener('click', async function(e) {
            let startTime = this.getAttribute('data-start-time');
            e.preventDefault();
            e.stopPropagation();
            let text = document.getElementById('text-' + startTime).innerText;
            if(containsChinese(text)){
                console.log("包含中文",text)
                return;
            }
             // 清理上一次的翻译结果
            sanitizeAiResult(startTime);
            let el = document.getElementById('text-' + startTime);
            el.innerHTML += `<div class='loading'>${loading}<div>AI 分析中....</div></div>`;
            ytVideoEl.pause()
            let result = await fetchGPTKeywords(text);
            el.insertAdjacentHTML('afterend', `<div class='keywords-text' id='keywords-${startTime}'>${result}</div>`);

            ytVideoEl.play()
            let loadingEl = el.querySelector('.loading');
            if (loadingEl) {
                loadingEl.remove(); 
            }
        });
    });
    // 监听暂停/开始按钮
    document.getElementById("yt_ai_summary_header_track").addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (ytVideoEl.paused) {
            // 如果视频已经暂停，则执行播放
            ytVideoEl.play();
        } else {
            ytVideoEl.pause();
        }
    })

    // 监听复制按钮
    document.querySelector("#yt_ai_summary_header_copy").addEventListener("click", (e) => {
        e.stopPropagation();
        copyTranscript();
    })
    
}

// 处理全屏模式切换事件的函数
function handleFullScreenChange() {
    if (document.fullscreenElement) {
      // 进入全屏模式
      console.log('进入全屏模式');
      sanitizeWidget();
      // 在这里执行你想要的操作
    } else {
      // 退出全屏模式
      console.log('退出全屏模式');
      // 在这里执行你想要的操作
    }
}

function evtListenerOnScreen(){
    // 监听全屏模式切换事件
    document.addEventListener('fullscreenchange', handleFullScreenChange);
}
