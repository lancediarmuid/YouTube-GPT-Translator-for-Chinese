import { insertExtension } from './action';

let oldHref = '';
window.onload = async () => {
  const ele = document.getElementsByClassName('hercules_container');
  if (window.location.hostname === 'www.youtube.com') {
    if (window.location.search !== '' && window.location.search.includes('v=')) {
      console.log('第一次加载Youtube视频，插入扩展');
      // insertExtension();
    }

    const bodyList = document.querySelector('body');
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(() => {
        if (oldHref !== document.location.href) {
          oldHref = document.location.href;
          if (ele.length === 0) {
            insertExtension();
          } else {
            while (ele.length > 0) {
              ele[0].remove();
            }
            insertExtension();
          }
        }
      });
    });
    observer.observe(bodyList, { childList: true, subtree: true });
  }
};
