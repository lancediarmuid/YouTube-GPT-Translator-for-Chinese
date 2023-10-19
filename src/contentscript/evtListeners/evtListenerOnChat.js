/* eslint-disable no-undef */
// eslint-disable-next-line import/no-cycle
import { readLocalStorage } from '../utils';
import { bar } from '../component';
import { requestGpt } from '../api';
import { getTranscript } from '../transcript';
import { resetSubtitles } from '../action';

async function handleData() {
  const btn = document.getElementById('hercules-submit');
  const input = document.getElementById('hercules_input');
  let text = input.value;
  const body = document.querySelector('#hercules_text');
  body.innerHTML = '';
  input.value = '';
  btn.style.display = 'none';
  input.placeholder = 'AI is typing...';
  const transcript = await getTranscript();
  const regex = /视频|video/i;
  const containsVideo = regex.test(text);
  if (containsVideo && transcript) {
    text = `${text}.Below are the subtitles of the video:${transcript}。`;
  }
  const stream = await requestGpt(text, true);
  for await (const part of stream) {
    if (part.choices) {
      const char = part.choices[0]?.delta?.content || '';
      body.insertAdjacentHTML('beforeend', char);
    } else {
      body.insertAdjacentHTML('beforeend', 'GPT Error,Please refresh the page');
    }
  }
  btn.style.display = 'block';
  input.placeholder = '';
}
async function evtListenerOnChatInput() {
  const btn = document.getElementById('hercules-submit');

  btn.addEventListener('click', async (e) => {
    e.stopPropagation();
    handleData();
  });
}
async function evtListenerOnChat() {
  document.getElementById('yt_ai_header_chat').addEventListener('click', async (e) => {
    e.stopPropagation();
    let apikey = null;
    try {
      apikey = await readLocalStorage();
    } catch (error) {
      const alertText = chrome.i18n.getMessage('alert');
      alert(alertText);
      return error;
    }
    if (apikey) {
      const svg = document.querySelector('#yt_ai_header_chat svg');
      if (svg.getAttribute('fill') === '#065fd4') {
        resetSubtitles();
      } else {
        document.querySelector('.hercules_container').insertAdjacentHTML('afterbegin', bar);
        svg.setAttribute('fill', '#065fd4');
        evtListenerOnChatInput();
      }
    } else {
      const alertText = chrome.i18n.getMessage('alert');
      alert(alertText);
    }
  });
}

export default evtListenerOnChat;
