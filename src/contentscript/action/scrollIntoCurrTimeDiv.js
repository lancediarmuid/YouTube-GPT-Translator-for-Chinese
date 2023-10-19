import { getTYCurrentTime, getTYEndTime } from '../component';
// eslint-disable-next-line import/no-cycle
import { insertGptTranslation } from '.';

// 该函数每秒执行一次，但是要对条件进行严格判断；
const scrollIntoCurrTimeDiv = () => {
  // 当前视频播放时间点
  const currTime = getTYCurrentTime();
  Array.from(document.getElementsByClassName('hercules_transcript_text')).forEach(async (el, i, arr) => {
    const startTimeOfEl = el.getAttribute('data-start-time');
    const startTimeOfNextEl = (i === arr.length - 1) ? getTYEndTime() : arr[i + 1].getAttribute('data-start-time') ?? 0;
    if (currTime >= startTimeOfEl && currTime < startTimeOfNextEl && !el.classList.contains('hover')) {
      // 当前字幕的颜色
      el.classList.add('hover');
      // 当前容器
      const container = document.querySelector('#yt_ai_summary_body');
      const containerRect = container.getBoundingClientRect();

      // 当前字幕的容器在浏览器窗口中的位置
      const boundingRect = el.getBoundingClientRect();
      // 当前字幕的时间戳
      const time = el.getAttribute('data-start-time');
      const translateElement = document.getElementById(`translate-${time}`);
      // 当前字幕翻译文本
      insertGptTranslation(el.innerText, translateElement);
      // 在展示区上部60%的区域内则不滚动, 但是需要检查是否开启了GPT功能
      if (boundingRect.top >= 0 && boundingRect.bottom <= window.innerHeight * 0.6) {
        return;
      }
      // 计算元素相对于容器的位置
      const scrollPos = boundingRect.top - containerRect.top + container.scrollTop;

      // 滚动到该位置
      container.scrollTo({
        top: scrollPos,
        behavior: 'smooth',
      });
    } else if (currTime < startTimeOfEl || currTime >= startTimeOfNextEl) {
      el.classList.remove('hover');
    }
  });
};

export default scrollIntoCurrTimeDiv;
