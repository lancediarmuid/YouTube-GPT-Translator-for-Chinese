import getSearchParam from '../utils/getSearchParam';
import { getLangOptionsWithLink, getTranscriptHTML } from '../transcript';
import { sanitizeWidget } from '../utils/sanitize';
import { noTranscriptionAlert, isWidgetOpen } from '../component';
import createLangSelectBtns from './createLangSelectBtns';
// eslint-disable-next-line import/no-cycle
import { addEventListenersOnTranscript } from '../evtListeners';
// eslint-disable-next-line import/no-unresolved
import evtListenerOnLangBtns from '../evtListeners/evtListenerOnLangBtns';
// eslint-disable-next-line import/no-cycle
// import scrollIntoCurrTimeDiv from './scrollIntoCurrTimeDiv';

async function init() {
  sanitizeWidget();

  if (!isWidgetOpen()) { return; }
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
  evtListenerOnLangBtns(langOptionsWithLink, videoId);
  // 字幕渲染完成后，监听事件
  document.querySelector('#hercules_text').innerHTML = transcriptHTML;
  // 监听翻译按钮
  addEventListenersOnTranscript();
  // 点击Google翻译作为默认翻译
  document.querySelector('#hercules_translate').click();
}

export default init;
