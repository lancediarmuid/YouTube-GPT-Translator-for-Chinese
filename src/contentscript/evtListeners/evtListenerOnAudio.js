// eslint-disable-next-line import/no-cycle
import { readLocalStorage, synthesizeSpeech, recognizeSpeech } from '../utils';
import { ytVideoEl } from '../component';

async function evtListenerOnAudio() {
  console.log("取消语音监听")
  // document.getElementById('yt_ai_header_audio').addEventListener('click', async (e) => {
  //   e.stopPropagation();
  //   e.stopPropagation();
  //   let apikey = null;
  //   try {
  //     apikey = await readLocalStorage();
  //   } catch (error) {
  //     alert('Please input your OpenAI API key in the extension popup. If you have not registered, please visit https://openai.com/ to register.\n 请在扩展弹出窗口中输入您的OpenAI API密钥。\n 如果您尚未注册，请访问https://openai.com/注册。或者直接与我们联系代购API，联系方式：lewis.q.zhang@gmail.com');
  //     return error;
  //   }
  //   if (apikey) {
  //     const svg = document.querySelector('#yt_ai_header_audio svg');
  //     if (svg.getAttribute('fill') === '#065fd4') {
  //       svg.setAttribute('fill', '#828282');
  //       ytVideoEl.play();
  //     } else {
  //       ytVideoEl.pause();
  //       svg.setAttribute('fill', '#065fd4');
  //       synthesizeSpeech('您好，有什么要问我的吗？');
  //       setTimeout(async () => {
  //         recognizeSpeech();
  //       }, 3500);
  //     }
  //   } else {
  //     alert('Please input your OpenAI API key in the extension popup. If you have not registered, please visit https://openai.com/ to register.\n 请在扩展弹出窗口中输入您的OpenAI API密钥。\n 如果您尚未注册，请访问https://openai.com/注册。或者直接与我们联系代购API，联系方式：lewis.q.zhang@gmail.com');
  //   }
  // });
}

export default evtListenerOnAudio;
