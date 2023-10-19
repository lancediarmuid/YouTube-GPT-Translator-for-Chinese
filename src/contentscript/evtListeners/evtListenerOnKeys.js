import { getTYCurrentTime, getTYEndTime, ytVideoEl } from '../component';

const evtListenerOnKeys = () => {
  document.addEventListener('keydown', (event) => {
    const currTime = getTYCurrentTime();
    const texts = document.getElementsByClassName('hercules_transcript_text');

    if (event.key === '[') {
      Array.from(texts).forEach(async (el, i, arr) => {
        const startTimeOfEl = el.getAttribute('data-start-time');
        const startTimeOfNextEl = (i === arr.length - 1) ? getTYEndTime() : arr[i + 1].getAttribute('data-start-time') ?? 0;
        if (currTime >= startTimeOfEl && currTime < startTimeOfNextEl) {
          if (arr[i - 1]) {
            const timepoint = arr[i - 1].getAttribute('data-start-time');
            ytVideoEl.currentTime = timepoint;
          }
        }
      });
    }
    if (event.key === ']') {
      Array.from(texts).forEach(async (el, i, arr) => {
        const startTimeOfEl = el.getAttribute('data-start-time');
        const startTimeOfNextEl = (i === arr.length - 1) ? getTYEndTime() : arr[i + 1].getAttribute('data-start-time') ?? 0;
        if (currTime >= startTimeOfEl && currTime < startTimeOfNextEl) {
          if (arr[i + 1]) {
            const timepoint = arr[i + 1].getAttribute('data-start-time');
            ytVideoEl.currentTime = timepoint;
          }
        }
      });
    }
    if (event.key === ';') {
      Array.from(texts).forEach(async (el, i, arr) => {
        const startTimeOfEl = el.getAttribute('data-start-time');
        const startTimeOfNextEl = (i === arr.length - 1) ? getTYEndTime() : arr[i + 1].getAttribute('data-start-time') ?? 0;
        if (currTime < startTimeOfEl && currTime > startTimeOfNextEl) {
          ytVideoEl.currentTime = startTimeOfEl;
        }
      });
    }
  });
};

export default evtListenerOnKeys;
