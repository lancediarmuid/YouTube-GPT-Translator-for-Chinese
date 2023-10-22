/* eslint-disable no-undef */
// eslint-disable-next-line import/no-cycle
import { readLocalStorage } from '../utils';
import { getTYCurrentTime, getTYEndTime } from '../component';
import { insertGptTranslation, resetSubtitles } from '../action';

async function request() {
  let apikey = '';
  try {
    apikey = await readLocalStorage();
  } catch (error) {
    const alertText = chrome.i18n.getMessage('alert');
    alert(alertText);
    return error;
  }

  if (apikey) {
    const transcriptSegment = document.querySelector('.transcript_text_segment');
    if (!transcriptSegment) {
      resetSubtitles();
      return;
    }
    const svg = document.querySelector('#hercules_gpt svg');
    const googleSvg = document.querySelector('#hercules_translate svg');

    const transcript = document.getElementsByClassName('hercules_transcript_text');
    // 当前已开启GPT功能
    if (svg.getAttribute('fill') === '#eacd76') {
      // 清空所有的翻译文本
      Array.from(transcript).forEach(async (el) => {
        const time = el.getAttribute('data-start-time');
        document.getElementById(`translate-${time}`).innerText = '';
      });
      svg.setAttribute('fill', '#828282');
    } else {
      Array.from(transcript).forEach(async (el) => {
        const time = el.getAttribute('data-start-time');
        document.getElementById(`translate-${time}`).innerText = '';
      });
      svg.setAttribute('fill', '#eacd76');
      googleSvg.setAttribute('fill', '#828282');
      const currTime = getTYCurrentTime();
      Array.from(document.getElementsByClassName('hercules_transcript_text')).forEach(async (el, i, arr) => {
        const startTimeOfEl = el.getAttribute('data-start-time');
        const startTimeOfNextEl = (i === arr.length - 1) ? getTYEndTime() : arr[i + 1].getAttribute('data-start-time') ?? 0;
        if (currTime >= startTimeOfEl && currTime < startTimeOfNextEl) {
          const time = el.getAttribute('data-start-time');
          const translateElement = document.getElementById(`translate-${time}`);
          insertGptTranslation(el.innerText, translateElement);
        }
      });
    }
  } else {
    const alertText = chrome.i18n.getMessage('alert');
    alert(alertText);
  }
}

function debounce(func, delay) {
  let timeoutId;

  return () => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      // eslint-disable-next-line prefer-rest-params
      func.apply(this, arguments);
    }, delay);
  };
}

const debouncedHandleClick = debounce(request, 500);

async function evtListenerOnGPT() {
  document.getElementById('hercules_gpt').addEventListener('click', debouncedHandleClick);
}

export default evtListenerOnGPT;
