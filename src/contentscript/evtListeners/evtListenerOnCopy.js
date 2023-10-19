import { copyTranscript } from '../transcript';

const evtListenerOnCopy = () => {
  const copyBtn = document.querySelector('#hercules_copy');
  copyBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    const transcript = document.querySelector('.hercules_transcript_text');
    if (transcript.innerText) {
      copyTranscript();
    }
  });
};

export default evtListenerOnCopy;
