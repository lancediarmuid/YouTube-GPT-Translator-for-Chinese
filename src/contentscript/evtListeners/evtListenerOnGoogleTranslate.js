// eslint-disable-next-line import/no-cycle
import { requestGoogle } from '../api';
import { resetSubtitles } from '../action';

const evtListenerOnGoogleTranslate = () => {
  document.getElementById('hercules_translate').addEventListener('click', async (e) => {
    e.stopPropagation();
    e.stopPropagation();

    const transcriptSegment = document.querySelector('.transcript_text_segment');
    if (!transcriptSegment) {
      resetSubtitles();
      return;
    }

    const translationText = document.querySelector('.translation-text');
    const svg = document.querySelector('#hercules_translate svg');

    if (translationText && translationText.innerText) {
      svg.setAttribute('fill', '#828282');
      Array.from(document.getElementsByClassName('hercules_transcript_text')).forEach(async (el) => {
        const time = el.getAttribute('data-start-time');
        document.getElementById(`translate-${time}`).innerText = '';
      });
    } else {
      svg.setAttribute('fill', '#065fd4');
      const gptSvg = document.querySelector('#hercules_gpt svg');
      gptSvg.setAttribute('fill', '#828282');
      Array.from(document.getElementsByClassName('hercules_transcript_text')).forEach(async (el) => {
        const text = el.innerText;
        const res = await requestGoogle(text);
        const time = el.getAttribute('data-start-time');
        if (document.getElementById(`translate-${time}`)) {
          document.getElementById(`translate-${time}`).innerText = res;
        }
      });
    }
  });
};

export default evtListenerOnGoogleTranslate;
