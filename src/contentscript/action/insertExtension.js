/* eslint-disable no-undef */
// eslint-disable-next-line import/no-cycle
import { getSearchParam } from '../utils';
import waitForElm from './waitForElm';
import {
  main,
  isWidgetOpen,
} from '../component';
import init from './init';
import { addEventListenersOnTopBtns } from '../evtListeners';
import scrollIntoCurrTimeDiv from './scrollIntoCurrTimeDiv';

const YOUTUBE_NATIVE = '#secondary.style-scope.ytd-watch-flexy';

function insertExtension() {
  const langSelect = document.querySelector('#hercules_lang_select');
  const summaryElement = document.querySelector('#hercules_summary');
  const container = document.querySelectorAll('.hercules_container');
  // 清空小部件
  if (langSelect) {
    langSelect.innerHTML = '';
  }
  if (summaryElement) {
    summaryElement.innerHTML = '';
  }
  Array.from(container).forEach((el) => { el.remove(); });
  if (!getSearchParam(window.location.href).v) { return null; }

  waitForElm(YOUTUBE_NATIVE).then(() => {
    const insertPoint = document.querySelector(YOUTUBE_NATIVE);
    // 插入扩展UI
    insertPoint.insertAdjacentHTML('afterbegin', main);

    const googleTranslate = chrome.i18n.getMessage('google_translate');
    document.getElementById('hercules_translate').setAttribute('data-hover-label', googleTranslate);
    const gptTranslate = chrome.i18n.getMessage('gpt_translate');
    document.getElementById('hercules_gpt').setAttribute('data-hover-label', gptTranslate);
    const startStop = chrome.i18n.getMessage('start_stop');
    document.getElementById('hercules_track').setAttribute('data-hover-label', startStop);
    const copySubtitles = chrome.i18n.getMessage('copy_subtitles');
    document.getElementById('hercules_copy').setAttribute('data-hover-label', copySubtitles);
    const chat = chrome.i18n.getMessage('chat');
    document.getElementById('yt_ai_header_chat').setAttribute('data-hover-label', chat);
    // const audio = chrome.i18n.getMessage('audio');
    // document.getElementById('yt_ai_header_audio').setAttribute('data-hover-label', audio);

    // 插入头部按钮的事件监听
    addEventListenersOnTopBtns();
    init();
    if (!isWidgetOpen()) {
      init();
    }

    document.querySelector('#yt_ai_header_toggle').addEventListener('click', async () => {
      init();
    });
  });

  setInterval(() => {
    const ytVideoEl = document.querySelector('#movie_player > div.html5-video-container > video');
    const pauseIcon = document.querySelector('svg[data-icon="pause"]');
    const startIcon = document.querySelector('svg[data-icon="start"]');
    if (pauseIcon && startIcon) {
      if (ytVideoEl && ytVideoEl.paused) {
        startIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
      } else {
      // 如果视频已经暂停，则执行播放
        pauseIcon.style.display = 'block';
        startIcon.style.display = 'none';
      }
    }
    if (ytVideoEl.paused) { return; }
    if (!document.querySelector('#hercules_text')) { return; }
    scrollIntoCurrTimeDiv();
  }, 1000);
}

export default insertExtension;
