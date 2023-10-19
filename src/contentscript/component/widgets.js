export const ytVideoEl = document.querySelector('#movie_player > div.html5-video-container > video');
export const container = document.getElementsByClassName('hercules_container');
export const langSelect = document.querySelector('#hercules_lang_select');
export const summaryElement = document.querySelector('#hercules_summary');
export const hoverLabel = document.getElementsByClassName('yt_ai_header_hover_label');
export const hoverElement = document.getElementsByClassName('hercules-hover-el');

export function convertIntToHms(num) {
  const h = (num < 3600) ? 14 : 12;
  return (new Date(num * 1000).toISOString().substring(h, 19)).toString();
}

export function isWidgetOpen() {
  return document.querySelector('#yt_ai_summary_body').classList.contains('yt_ai_summary_body_show');
}

export function getTYCurrentTime() {
  return document.querySelector('#movie_player > div.html5-video-container > video').currentTime ?? 0;
}

export function getTYEndTime() {
  return document.querySelector('#movie_player > div.html5-video-container > video').duration ?? 0;
}
