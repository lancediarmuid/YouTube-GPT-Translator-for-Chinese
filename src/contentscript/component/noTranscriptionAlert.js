export default function noTranscriptionAlert() {
  // 显示无转录提示
  document.querySelector('#hercules_text').innerHTML = `
        <div style="margin: 40px auto;text-align: center;">
            <p>没有发现可用字幕😢</p>
            <p>Try <a href="https://huggingface.co/spaces/jeffistyping/Youtube-Whisperer" 
            target="_blank">Huggingface Youtube Whisperer</a> to transcribe!</p>
        </div>
    `;
}
