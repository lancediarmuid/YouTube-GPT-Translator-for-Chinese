import $ from 'jquery';
import { convertIntToHms } from '../component';

export async function getLangOptionsWithLink(videoId) {
  const videoPageResponse = await fetch(`https://www.youtube.com/watch?v=${videoId}`);
  // 读取当前视频页面的 HTML 源码
  const videoPageHtml = await videoPageResponse.text();
  // 从 HTML 源码中提取出视频的字幕 URL
  const splittedHtml = videoPageHtml.split('"captions":');
  if (splittedHtml.length < 2) {
    // splittedHtml的内容分为有字幕和无字幕两种
    return;
  }
  /**
   *  @param {Array} audioTracks
   *  @param {Array} captionTracks
   *  @param {Array} translationLanguages
   */
  const { playerCaptionsTracklistRenderer } = JSON.parse(splittedHtml[1].split(',"videoDetails')[0].replace('\n', ''));

  const { captionTracks } = playerCaptionsTracklistRenderer;
  // 提取字幕名称
  const languageOptions = Array.from(captionTracks).map((i) => i.name.simpleText);
  console.log(languageOptions);
  // 这里可能是English(United States)或者English
  let first = 'Chinese (Simplified)';
  if (navigator.language === 'zh-CN') {
    first = '英语';
  }

  languageOptions.sort((x, y) => {
    if (x.includes(first)) {
      return -1;
    } if (y.includes(first)) {
      return 1;
    }
    return 0;
  });

  languageOptions.sort((x, y) => {
    if (x === first) {
      return -1;
    } if (y === first) {
      return 1;
    }
    return 0;
  });

  const langs = Array.from(languageOptions).map((langName) => {
    const link = captionTracks.find((i) => i.name.simpleText === langName).baseUrl;
    return {
      language: langName,
      link,
    };
  });

  return langs;
}

export async function getRawTranscript(link) {
  // Get Transcript
  const transcriptPageResponse = await fetch(link); // default 0
  const transcriptPageXml = await transcriptPageResponse.text();

  // Parse Transcript
  const jQueryParse = $.parseHTML(transcriptPageXml);
  const textNodes = jQueryParse[1].childNodes;
  // 生成对象
  const items = Array.from(textNodes).map((i) => ({
    start: i.getAttribute('start'),
    duration: i.getAttribute('dur'),
    text: i.textContent.replace(/\[Music\]|\[音乐\]/g, ''),
  }));
  return items;
}

export async function getTranscriptFromEle(langOption) {
  const rawTranscript = await getRawTranscript(langOption.link);
  const transcript = rawTranscript.map((item) => item.text).join(' ');
  return transcript;
}

export async function getTranscriptHTML(link) {
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
    if (loop === 0) {
      tempObj.start = (remaining.start) ? remaining.start : obj.start;
    }

    loop += 1;

    function resetNums() {
      // eslint-disable-next-line no-unused-expressions, no-sequences
      loop = 0,
      chars = [],
      charCount = 0,
      timeSum = 0,
      tempObj = {};
    }

    const startSeconds = Math.round(tempObj.start);
    const seconds = Math.round(obj.start);
    timeSum = (seconds - startSeconds);
    charCount += obj.text.length;
    chars.push(obj.text);

    if (i === arr.length - 1) {
      tempObj.text = chars.join(' ').replace(/\n/g, ' ');
      scriptObjArr.push(tempObj);
      resetNums();
      return;
    }

    if (timeSum > timeUpperLimit) {
      tempObj.text = chars.join(' ').replace(/\n/g, ' ');
      scriptObjArr.push(tempObj);
      resetNums();
      return;
    }

    if (charCount > charInitLimit) {
      if (charCount < charUpperLimit) {
        if (obj.text.includes('.')) {
          const splitStr = obj.text.split('.');
          if (splitStr[splitStr.length - 1].replace(/\s+/g, '') === '') {
            tempObj.text = chars.join(' ').replace(/\n/g, ' ');
            scriptObjArr.push(tempObj);
            resetNums();
            return;
          }

          // Case: . is in the middle
          // 1. Get the (length - 2) str, then get indexOf + str.length + 1, then substring(0,x)
          // 2. Create remaining { text: str.substring(x), start: obj.start } => use the next loop
          const lastText = splitStr[splitStr.length - 2];
          const substrIndex = obj.text.indexOf(lastText) + lastText.length + 1;
          const textToUse = obj.text.substring(0, substrIndex);
          remaining.text = obj.text.substring(substrIndex);
          remaining.start = obj.start;

          // Replcae arr element
          chars.splice(chars.length - 1, 1, textToUse);
          tempObj.text = chars.join(' ').replace(/\n/g, ' ');
          scriptObjArr.push(tempObj);
          resetNums();
          return;
        }
        // Move onto next loop to find .
        return;
      }

      tempObj.text = chars.join(' ').replace(/\n/g, ' ');
      scriptObjArr.push(tempObj);
      resetNums();
    }
  });

  // function resetNums() {
  //   loop = 0,
  //   chars = [],
  //   charCount = 0,
  //   timeSum = 0,
  //   tempObj = {};
  // }

  return Array.from(scriptObjArr).map((obj) => {
    const t = Math.round(obj.start);
    const hhmmss = convertIntToHms(t);
    return `<div class="transcript_text_segment">  
                  <div id="transcript-${t}">
                    <div class="hercules_transcript_text" data-start-time="${t}" id="text-${t}">
                      ${obj.text}
                    </div>
                    <div id="translate-${t}" class='translation-text'>
                    </div>
                  </div>
                  <div>
                    <span class="hercules_transcript_text_timestamp" 
                      style="padding-top: 16px !important;" 
                      data-start-time="${t}">
                      ${hhmmss}
                    </span>
                  </div>
                 
              </div>`;
  }).join('');
}
