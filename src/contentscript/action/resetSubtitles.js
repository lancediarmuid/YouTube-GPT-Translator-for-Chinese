/* eslint-disable import/no-cycle */
import getSearchParam from '../utils/getSearchParam';
import { getLangOptionsWithLink, getTranscriptHTML } from '../transcript';
import { noTranscriptionAlert, loading } from '../component';
import { addEventListenersOnTranscript } from '../evtListeners';

const resetSubtitles = async () => {
  const transcriptSegment = document.querySelector('.transcript_text_segment');
  if (!transcriptSegment) {
    document.querySelector('#hercules_text').innerHTML = loading;
    const videoId = getSearchParam(window.location.href).v;
    // 获取语言选项的字幕链接
    const langOptionsWithLink = await getLangOptionsWithLink(videoId);
    // 没有字幕则提示用户
    if (!langOptionsWithLink) {
      noTranscriptionAlert();
    }
    const bar = document.getElementById('hercules_bar');
    if (bar) {
      bar.remove();
    }
    const svgs = document.querySelectorAll('.hercules-hover-el svg');
    svgs.forEach((element) => {
      element.setAttribute('fill', '#828282');
    });
    const transcriptHTML = await getTranscriptHTML(langOptionsWithLink[0].link, videoId);
    document.querySelector('#hercules_text').innerHTML = transcriptHTML;
    addEventListenersOnTranscript();
  } else {
    const bar = document.getElementById('hercules_bar');
    if (bar) {
      bar.remove();
    }
    const svgs = document.querySelectorAll('.hercules-hover-el svg');
    svgs.forEach((element) => {
      element.setAttribute('fill', '#828282');
    });
  }
};

export default resetSubtitles;
