function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.position = 'fixed';

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  document.body.removeChild(textArea);
}

function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
  } else {
    navigator.clipboard.writeText(text).then(() => {
    }, (err) => {
      console.log(err);
    });
  }
}

function copyTranscript() {
  let contentBody = '';
  let { title } = document;
  title = title.replace(/- YouTube/g, '');
  contentBody += `${title}\n`;
  contentBody += 'Transcript:\n';
  Array.from(document.getElementById('hercules_text').children).forEach((el) => {
    if (!el) { return; }
    if (el.children.length < 2) { return; }
    const text = el.querySelector('.hercules_transcript_text').innerText;
    contentBody += `${text}`;
  });
  copyTextToClipboard(contentBody);
}

export default copyTranscript;
