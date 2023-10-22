export default function noTranscriptionAlert() {
  // 显示无转录提示
  document.querySelector('#hercules_text').innerHTML = `
        <div style="margin: 40px auto;text-align: center;">
            <p>No available subtitles found.😢</p>
        </div>
    `;
}
