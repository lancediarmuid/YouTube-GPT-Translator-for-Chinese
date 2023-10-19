import { loading } from '../component';

export function sanitizeAiResult(startTime) {
  const translation = document.getElementById(`translation-${startTime}`);
  if (translation) {
    translation.remove();
  }
}

export function sanitizeWidget() {
  // 清空语言选型按钮
  const langSelect = document.querySelector('#hercules_lang_select');
  // 清空字幕区域
  const text = document.querySelector('#hercules_text');
  const popup = document.querySelector('#popup');
  const body = document.querySelector('#yt_ai_summary_body');
  const talkBar = document.querySelector('#hercules_bar');

  if (talkBar) { talkBar.remove(); }
  if (popup) {
    popup.remove();
  }
  if (langSelect) {
    langSelect.innerHTML = '';
  }
  if (!langSelect) {
    body.insertAdjacentHTML('afterbegin', '<div id="hercules_lang_select" class="hercules_lang_select"></div>');
  }
  if (text) {
    text.innerHTML = '';
  }
  if (!text) {
    body.insertAdjacentHTML('afterbegin', '<div id="hercules_text" class="hercules_text"></div>');
  }

  // 调整高度
  body.style.maxHeight = `${window.innerHeight - 160}px`;
  // 总结区域出现加载动画
  document.querySelector('#hercules_text').innerHTML = loading;

  // 切换类列表
  body.classList.toggle('yt_ai_summary_body_show');
  document.querySelector('#yt_ai_header_toggle').classList.toggle('yt_ai_header_toggle_rotate');

  const textboard = document.getElementById('hercules_text');
  // 删除文本的划词的监听
  textboard.removeEventListener('mouseup', (e) => { console.log(e); });
  // 删除快捷键的监听
  document.removeEventListener('keydown', (e) => { console.log(e); });
}
