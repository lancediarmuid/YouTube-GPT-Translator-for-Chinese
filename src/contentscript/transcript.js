import $ from "jquery";
import { convertIntToHms } from "./utils";

export async function getLangOptionsWithLink(videoId) {
  const videoPageResponse = await fetch("https://www.youtube.com/watch?v=" + videoId);
  // 读取当前视频页面的 HTML 源码
  const videoPageHtml = await videoPageResponse.text();
  // 从 HTML 源码中提取出视频的字幕 URL
  const splittedHtml = videoPageHtml.split('"captions":')
  if (splittedHtml.length < 2) { 
    //splittedHtml的内容分为有字幕和无字幕两种
    return; 
  } 
  /**
   *  @param {Array} audioTracks 
   *  @param {Array} captionTracks 
   *  @param {Array} translationLanguages 
   */
  const {playerCaptionsTracklistRenderer} = JSON.parse(splittedHtml[1].split(',"videoDetails')[0].replace('\n', ''));

  const {captionTracks} = playerCaptionsTracklistRenderer;
  // 提取字幕名称
  const languageOptions = Array.from(captionTracks).map(i => { return i.name.simpleText; })
  
  const first = "English"; 
  // 对字幕进行排序
  languageOptions.sort(function(x,y){ return x.includes(first) ? -1 : y.includes(first) ? 1 : 0; });
  languageOptions.sort(function(x,y){ return x == first ? -1 : y == first ? 1 : 0; });

  return Array.from(languageOptions).map((langName, index) => {
    // 拿到对应语言的字幕 URL
    const link = captionTracks.find(i => i.name.simpleText === langName).baseUrl;
    return {
      language: langName,
      link: link
    }
  })

}

export async function getTranscript(langOption) {
  const rawTranscript = await getRawTranscript(langOption.link);
  const transcript = rawTranscript.map((item) => { return item.text; }).join(' ');
  return transcript;
}


export async function getRawTranscript(link) {
  // Get Transcript
  const transcriptPageResponse = await fetch(link); // default 0
  const transcriptPageXml = await transcriptPageResponse.text();

  // Parse Transcript
  const jQueryParse = $.parseHTML(transcriptPageXml);
  const textNodes = jQueryParse[1].childNodes;
  // 生成对象
  let items = Array.from(textNodes).map(i => {
    return {
      start: i.getAttribute("start"),
      duration: i.getAttribute("dur"),
      text: i.textContent,
    };
  });
  return items;
}

export async function getTranscriptHTML(link, videoId) {

  const rawTranscript = await getRawTranscript(link);

  const scriptObjArr = [];
  const timeUpperLimit = 60;
  const charInitLimit = 300;
  const charUpperLimit = 500;
  let loop = 0;
  let chars = [];
  let charCount = 0;
  let timeSum = 0;
  let tempObj = {};
  let remaining = {};

  // Sum-up to either total 60 seconds or 300 chars.
  Array.from(rawTranscript).forEach((obj, i, arr) => {

      // Check Remaining Text from Prev Loop
      if (remaining.start && remaining.text) {
          tempObj.start = remaining.start;
          chars.push(remaining.text);
          remaining = {}; // Once used, reset to {}
      }

      // Initial Loop: Set Start Time
      if (loop == 0) {
          tempObj.start = (remaining.start) ? remaining.start : obj.start;
      }

      loop++;

      const startSeconds = Math.round(tempObj.start);
      const seconds = Math.round(obj.start);
      timeSum = (seconds - startSeconds);
      charCount += obj.text.length;
      chars.push(obj.text);

      if (i == arr.length - 1) {
          tempObj.text = chars.join(" ").replace(/\n/g, " ");
          scriptObjArr.push(tempObj);
          resetNums();
          return;
      }

      if (timeSum > timeUpperLimit) {
          tempObj.text = chars.join(" ").replace(/\n/g, " ");
          scriptObjArr.push(tempObj);
          resetNums();
          return;
      }

      if (charCount > charInitLimit) {

          if (charCount < charUpperLimit) {
              if (obj.text.includes(".")) {
                  const splitStr = obj.text.split(".");
                  // Case: the last letter is . => Process regulary
                  if (splitStr[splitStr.length-1].replace(/\s+/g, "") == "") {
                      tempObj.text = chars.join(" ").replace(/\n/g, " ");
                      scriptObjArr.push(tempObj);
                      resetNums();
                      return;
                  }

                  // Case: . is in the middle
                  // 1. Get the (length - 2) str, then get indexOf + str.length + 1, then substring(0,x)
                  // 2. Create remaining { text: str.substring(x), start: obj.start } => use the next loop
                  const lastText = splitStr[splitStr.length-2];
                  const substrIndex = obj.text.indexOf(lastText) + lastText.length + 1;
                  const textToUse = obj.text.substring(0,substrIndex);
                  remaining.text = obj.text.substring(substrIndex);
                  remaining.start = obj.start;

                  // Replcae arr element
                  chars.splice(chars.length-1,1,textToUse)
                  tempObj.text = chars.join(" ").replace(/\n/g, " ");
                  scriptObjArr.push(tempObj);
                  resetNums();
                  return;
              } else {
                  // Move onto next loop to find .
                  return;
              }
          }

          tempObj.text = chars.join(" ").replace(/\n/g, " ");
          scriptObjArr.push(tempObj);
          resetNums();
          return;

      }

  })
  
  function resetNums() {
    loop = 0, 
    chars = [], 
    charCount = 0, 
    timeSum = 0, 
    tempObj = {};
  }

  return Array.from(scriptObjArr).map(obj => {
      const t = Math.round(obj.start);
      const hhmmss = convertIntToHms(t);
      return  `<div class="yt_ai_summary_transcript_text_segment">
                  <div>
                    <a class="yt_ai_summary_transcript_text_timestamp" 
                        style="padding-top: 16px !important;" 
                        href="/watch?v=${videoId}&t=${t}s"
                        target="_blank" 
                        data-timestamp-href="/watch?v=${videoId}&t=${t}s" 
                        data-start-time="${t}">
                        ${hhmmss}
                    </a>
                  </div>
                  <div id="transcript-${t}">
                    <div class="yt_ai_summary_transcript_text" data-start-time="${t}" id="text-${t}">
                      ${obj.text}
                    </div>
                    <div>
                      <button class="translate" id="translate-btn-${t}" data-start-time="${t}">段落翻译</button>
                      <button class="gramma" id="gramma-btn-${t}" data-start-time="${t}">词法分析</button>
                    </div>
                  </div>
              </div>`
  }).join("");
  
  

}

