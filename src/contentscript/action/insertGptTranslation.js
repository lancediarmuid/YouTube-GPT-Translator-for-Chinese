// eslint-disable-next-line import/no-cycle
import { requestGpt } from '../api';

/**
 * @param {string} sourceText
 * @param {HTMLElement} targetElement
 * @returns {Promise<string>}
 */
async function insertGptTranslation(sourceText, targetElement) {
  const gptsvg = document.querySelector('#hercules_gpt svg');
  if (gptsvg.getAttribute('fill') === '#eacd76' && sourceText && targetElement.innerText === '') {
    const stream = await requestGpt(`${sourceText}.Please translate it`, true);
    for await (const part of stream) {
      if (part.choices) {
        const char = part.choices[0]?.delta?.content || '';
        targetElement.insertAdjacentHTML('beforeend', char);
      } else {
        targetElement.insertAdjacentHTML('beforeend', 'GPT Error,Please refresh the page');
      }
    }
  } else {
    return null;
  }
}

export default insertGptTranslation;
