function pureTranscript() {
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
  return contentBody;
}

export default pureTranscript;
