import { loading } from '../component';
// eslint-disable-next-line import/no-cycle
import { requestGoogle, requestGpt } from '../api';
import { readLocalStorage } from '../utils';

const evtListenerOnHighlight = () => {
  // 监听字幕区域的划词事件
  const textboard = document.getElementById('yt_ai_summary_body');
  textboard.addEventListener('mouseup', async (event) => {
    const ytVideoEl = document.querySelector('#movie_player > div.html5-video-container > video');
    event.preventDefault();
    event.stopPropagation();
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    if (selectedText.length > 1) {
      const popup = document.createElement('div');
      popup.id = 'popup';
      popup.style.position = 'absolute';
      popup.style.padding = '10px';
      popup.style.zIndex = '9999';
      popup.style.display = 'none'; // 默认隐藏
      // 添加 div 到文档
      document.body.appendChild(popup);
      const rect = selection.getRangeAt(0).getBoundingClientRect();
      // 设置 div 的位置
      popup.style.left = `${rect.left}px`;
      popup.style.top = `${rect.top - popup.offsetHeight + 30}px`;
      popup.innerHTML = `<h3>${selectedText}</h3><p>${loading}</p>`;
      popup.style.display = 'block';
      ytVideoEl.pause();
      try {
        popup.innerHTML = `<h3>${selectedText}</h3><div id="gpt-result"></div>`;
        const gptResultDiv = document.querySelector('#gpt-result');
        const apikey = await readLocalStorage();
        if (!apikey) {
          const text = await requestGoogle(selectedText);
          gptResultDiv.insertAdjacentHTML('beforeend', text);
        } else {
          const titleEle = document.getElementById('yt_ai_header_text');
          const lang = titleEle.options[titleEle.selectedIndex].text;
          const stream = await requestGpt(`${selectedText}。What's mean。Output should be ${lang}`, true);
          for await (const chunk of stream) {
            if (chunk.choices) {
              gptResultDiv.insertAdjacentHTML('beforeend', chunk.choices[0]?.delta?.content || '');
            }
          }
        }
      } catch (e) {
        if (popup && popup.innerHTML) {
          popup.innerHTML = `<h3>${selectedText}</h3><p>出现未知网络错误</p>`;
        }
      }
    }
  });

  document.addEventListener('mousedown', (event) => {
    const ytVideoEl = document.querySelector('#movie_player > div.html5-video-container > video');
    const popup = document.getElementById('popup');
    if (popup && !popup.contains(event.target)) {
      popup.remove();
      ytVideoEl.play();
    }
  });
};

export default evtListenerOnHighlight;
