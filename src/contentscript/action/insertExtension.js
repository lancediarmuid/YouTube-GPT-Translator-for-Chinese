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
  // 打开或创建数据库
  const request = indexedDB.open('tubexprod', 1);

  // 处理数据库版本变化
  request.onupgradeneeded = function (event) {
    const db = event.target.result;

    // 创建一个对象存储空间（表）
    const objectStore = db.createObjectStore('myObjectStore', { keyPath: 'id', autoIncrement: true });

    // 定义存储对象的属性
    objectStore.createIndex('title', 'title', { unique: true });
    objectStore.createIndex('media', 'media', { unique: false });
    objectStore.createIndex('desc', 'desc', { unique: false });
    objectStore.createIndex('timestamp', 'timestamp', { unique: false });
  };

  // 处理数据库打开成功
  request.onsuccess = function (event) {
    const db = event.target.result;

    // 开启一个事务
    const transaction = db.transaction(['myObjectStore'], 'readwrite');

    // 获取存储对象
    const objectStore = transaction.objectStore('myObjectStore');

    // 获取视频标题
    const titleEle = document.querySelector('.ytd-watch-metadata');
    if (titleEle) {
      const rawText = titleEle.innerText;
      const originalArray = rawText.split('\n');
      // eslint-disable-next-line no-restricted-globals
      const filteredArray = originalArray.filter((item) => item !== '' && item !== ' ' && isNaN(item));
      const data = {
        title: filteredArray[0],
        media: filteredArray[1],
        desc: filteredArray[6],
        timestamp: new Date(),
      };

      // 向存储对象添加数据
      const req = objectStore.add(data);

      // 处理存储成功后的回调
      req.onsuccess = function () {
        console.log('Data added to IndexedDB');
      };

      // 处理事务完成后的回调
      transaction.oncomplete = function () {
        console.log('Transaction completed');
      };

      // 处理事务错误
      transaction.onerror = function () {
        console.log('Transaction error:', event.target.error);
      };

      // function readAll() {
      //   const objectStore = db.transaction('myObjectStore').objectStore('myObjectStore');

      //   objectStore.openCursor().onsuccess = function (event) {
      //     const cursor = event.target.result;

      //     if (cursor) {
      //       console.log(`${cursor.value.title}`);
      //       cursor.continue();
      //     } else {
      //       console.log('没有更多数据了！');
      //     }
      //   };
      // }
      // readAll();

      // 关闭数据库连接
      db.close();
    }

    // 处理数据库打开失败
    request.onerror = function (e) {
      console.log('Database error:', e.target.error);
    };
  };
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
    if (ytVideoEl && ytVideoEl.paused) { return; }
    if (!document.querySelector('#hercules_text')) { return; }
    scrollIntoCurrTimeDiv();
  }, 1000);
}

export default insertExtension;
