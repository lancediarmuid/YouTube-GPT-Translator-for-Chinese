import $ from 'jquery';
import getSearchParam from '../utils/getSearchParam';

async function getTranscript() {
  const videoId = getSearchParam(window.location.href).v;
  const videoPageResponse = await fetch(`https://www.youtube.com/watch?v=${videoId}`);
  const videoPageHtml = await videoPageResponse.text();
  const splittedHtml = videoPageHtml.split('"captions":');
  if (splittedHtml.length < 2) {
    return;
  }
  const { playerCaptionsTracklistRenderer } = JSON.parse(splittedHtml[1].split(',"videoDetails')[0].replace('\n', ''));
  /**
   * @param {String} baseUrl
   * @param {Object} name
   * @param {String} name.simpleText
   * @param {String} vssId
   * @param {String} languageCode
   * @param {Boolean} isTranslatable
   */

  const { captionTracks } = playerCaptionsTracklistRenderer;
  // 当前浏览器所使用的语言
  const lang = navigator.language;
  const caption = captionTracks.find((track) => track.languageCode === 'en' || track.languageCode === lang);
  const baseUrl = caption ? caption.baseUrl : null;
  if (!baseUrl) {
    return '';
  }
  const transcriptPageResponse = await fetch(baseUrl); // default 0
  const transcriptPageXml = await transcriptPageResponse.text();

  const jQueryParse = $.parseHTML(transcriptPageXml);
  const textNodes = jQueryParse[1].childNodes;
  let str = '';
  Array.from(textNodes).forEach((i) => {
    str += i.textContent;
  });
  console.log('getTranscript', str);

  return str;
}

export default getTranscript;
