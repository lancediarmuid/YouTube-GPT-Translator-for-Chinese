// eslint-disable-next-line import/no-cycle
import evtListenerOnTimestamp from './evtListenerOnTimestamp';
import { getTranscriptHTML } from '../transcript';
// 语言切换按钮
const evtListenerOnLangBtns = (langOptionsWithLink, videoId) => {
  const langs = Array.from(document.getElementsByClassName('yt_ai_summary_lang'));
  langs.forEach((langBtn) => {
    langBtn.addEventListener('click', async (e) => {
      const lang = e.target.getAttribute('data-yt-transcript-lang');
      const targetBtn = document.querySelector(`.yt_ai_summary_lang[data-yt-transcript-lang="${lang}"]`);
      const { link } = langOptionsWithLink.find((langOption) => langOption.language === lang);
      const transcriptHTML = await getTranscriptHTML(link, videoId);
      document.querySelector('#hercules_text').innerHTML = transcriptHTML;
      evtListenerOnTimestamp();

      targetBtn.classList.add('yt_ai_summary_lange_selected');
      Array.from(document.getElementsByClassName('yt_ai_summary_lang')).forEach((l) => {
        if (l !== targetBtn) {
          l.classList.remove('yt_ai_summary_lange_selected');
        }
      });
    });
  });
};

export default evtListenerOnLangBtns;
