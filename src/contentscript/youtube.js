"use strict";

import { getLangOptionsWithLink, getTranscriptHTML } from "./transcript";
import { getSearchParam,noTranscriptionAlert,createLangSelectBtns,fetchGPT,isWidgetOpen,
    containsChinese,handleFullScreenChange,getTYCurrentTime,getTYEndTime,ytVideoEl,
    fetchGPTKeywords,fetchGPTAnalysis,copyTranscript} from "./utils";
import { ui,loading } from "./ui";
import { waitForElm } from "./dom";

function evtListenerOnHeader() {
        let pauseIcon = document.querySelector('svg[data-icon="pause"]');
        let startIcon = document.querySelector('svg[data-icon="start"]');
    
        startIcon.style.display = "none";
        // 监听暂停/开始按钮
        document.getElementById("yt_ai_summary_header_track").addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (ytVideoEl.paused) {
                // 如果视频已经暂停，则执行播放
                pauseIcon.style.display = "block";
                startIcon.style.display = "none";
                ytVideoEl.play();
            } else {
                startIcon.style.display = "block";
                pauseIcon.style.display = "none";
                ytVideoEl.pause();
            }
        })
    
        // 监听复制按钮
        document.querySelector("#yt_ai_summary_header_copy").addEventListener("click", (e) => {
            console.log("复制")
            e.stopPropagation();
            copyTranscript();
        })
}

async function init(){
    console.log("init")
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

export function insertSummaryBtn() {

    // 清空小部件
    if (document.querySelector("#yt_ai_summary_lang_select")) { 
        document.querySelector("#yt_ai_summary_lang_select").innerHTML = ""; 
    }
    if (document.querySelector("#yt_ai_summary_summary")) { 
        document.querySelector("#yt_ai_summary_summary").innerHTML = ""; 
    }
    Array.from(document.getElementsByClassName("hercules_container")).forEach(el => { el.remove(); });
    if (!getSearchParam(window.location.href).v) { return; }

    waitForElm('#secondary.style-scope.ytd-watch-flexy').then(() => {

        Array.from(document.getElementsByClassName("hercules_container")).forEach(el => { el.remove(); });
        // 注入插件UI
        document.querySelector("#secondary.style-scope.ytd-watch-flexy").insertAdjacentHTML("afterbegin", ui);
        evtListenerOnHeader()

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
        });

        if (!isWidgetOpen()){
            init()
        }

        // // 1.展开/收起小部件
        document.querySelector("#yt_ai_summary_header_toggle").addEventListener("click", async (e) => {
            init()
        })

        setInterval(function() {
            const ytVideoEl = document.querySelector("#movie_player > div.html5-video-container > video");
            let pauseIcon = document.querySelector('svg[data-icon="pause"]');
            let startIcon = document.querySelector('svg[data-icon="start"]');
            if (!ytVideoEl.paused) {
                startIcon.style.display = "none";
                pauseIcon.style.display = "block";
                scrollIntoCurrTimeDiv();
            }else{
                startIcon.style.display = "block";
                pauseIcon.style.display = "none";
            }
        }, 500);

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

// 监听划词
function evtListenerOnSelectText(){
    // 监听字幕区域的划词事件
    let textboard = document.getElementById('yt_ai_summary_text')
    textboard.addEventListener('mouseup', async function(event) {
        event.preventDefault();
        event.stopPropagation();
        // 当前选中的文本的上下文环境
        let context = event.target.innerText
        var selection = window.getSelection();
        var selectedText = selection.toString().trim();
        var englishWords = selectedText.match(/\b\w+\b/g);
        if (englishWords && !containsChinese(selectedText) && englishWords.length > 0  && englishWords.length < 5) { 
            var popup = document.createElement('div');
            popup.id = 'popup';
            popup.style.position = 'absolute';
            popup.style.padding ='30px';
            popup.style.zIndex = '9999';
            popup.style.display = 'none'; // 默认隐藏
            // 添加 div 到文档
            document.body.appendChild(popup);
            var rect = selection.getRangeAt(0).getBoundingClientRect();
            // 设置 div 的位置
            popup.style.left = rect.left-200 + 'px';
            popup.style.top = (rect.top - popup.offsetHeight+30) + 'px';
            popup.innerHTML = `<h3>${selectedText}</h3><p>${loading}</p>`;
            popup.style.display = 'block';
            ytVideoEl.pause();
            try{
                let result = await fetchGPTAnalysis(selectedText,context);
                popup.innerHTML = `<h3>${selectedText}</h3><p>${result}</p>`;
            }catch(e){
                popup.innerHTML = `<h3>${selectedText}</h3><p>出现未知网络错误</p>`;
            }
        }   
    });
    //
    document.addEventListener('mousedown', function(event) {
        var popup = document.getElementById('popup');
        if (popup && !popup.contains(event.target)) {
            popup.remove();
            ytVideoEl.play()
        }
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
        try{
            let translation = await fetchGPT(text);
            el.insertAdjacentHTML('afterend', `<div class='translation-text' id='translation-${startTime}'>${translation}</div>`);
        }catch(e){
            el.insertAdjacentHTML('afterend', `<div class='translation-text' id='translation-${startTime}'>请填写您的OpenAI API KEY</div>`);
        }finally{
            ytVideoEl.play()
            let loadingEl = el.querySelector('.loading');
            if (loadingEl) {
                loadingEl.remove(); 
            }
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
            try{
                let result = await fetchGPTKeywords(text);
                el.insertAdjacentHTML('afterend', `<div class='keywords-text' id='keywords-${startTime}'>${result}</div>`);
            }catch(e){
                el.insertAdjacentHTML('afterend', `<div class='translation-text' id='translation-${startTime}'>请填写您的OpenAI API KEY</div>`);
            }finally{
                ytVideoEl.play()
                let loadingEl = el.querySelector('.loading');
                if (loadingEl) {
                    loadingEl.remove(); 
                }
            }
        });
    });

    
}

function evtListenerOnScreen(){
    // 监听全屏模式切换事件
    document.addEventListener('fullscreenchange', handleFullScreenChange);
}
