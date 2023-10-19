// 创建语言选择按钮,有些视频有多个语言的字幕
function createLangSelectBtns(langOptionsWithLink) {
  document.querySelector('#hercules_lang_select').innerHTML = Array.from(langOptionsWithLink).map((langOption, index) =>
  // 生成每个语言选项的HTML代码
    // eslint-disable-next-line implicit-arrow-linebreak
    `<button class="yt_ai_summary_lang ${(index === 0) ? 'yt_ai_summary_lange_selected'
      : ''}" data-yt-transcript-lang="${langOption.language}">${langOption.language}</button>`).join('');
}

export default createLangSelectBtns;
