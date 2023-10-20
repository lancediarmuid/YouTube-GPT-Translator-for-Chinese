/* eslint-disable no-undef */
function makeElementDraggable(element, parent) {
  const ele = element;
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  ele.addEventListener('mousedown', (event) => {
    event.preventDefault();
    event.stopPropagation();
    isDragging = true;
    offsetX = event.offsetX;
    offsetY = event.offsetY;
  });

  document.addEventListener('mousemove', (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (isDragging) {
      const x = event.clientX - offsetX;
      const y = event.clientY - offsetY;
      parent.style.left = `${x}px`;
      parent.style.top = `${y}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
}

function handleFullScreenChange() {
  chrome.storage.local.get(['opacity'], (result) => {
    const o = result.opacity || 100;
    const opacity = o / 100;
    const hercules = document.querySelector('.hercules_container');
    if (document.fullscreenElement) {
      hercules.style.zIndex = 9999;
      hercules.style.position = 'fixed';
      hercules.style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;
      hercules.style.top = '0px';
      hercules.style.right = '0px';
      hercules.style.backdropFilter = 'blur(10px)';
    } else {
      hercules.style.zIndex = null;
      hercules.style.position = null;
      hercules.style.top = null;
      hercules.style.backgroundColor = null;
      hercules.style.backdropFilter = null;
    }
    const header = document.querySelector('#yt_ai_summary_header');
    makeElementDraggable(header, hercules);
  });
}

const evtListenerOnScreen = () => {
  document.addEventListener('fullscreenchange', handleFullScreenChange);
  const playerElement = document.querySelector('.html5-video-player');
  const hercules = document.querySelector('.hercules_container');
  const ro = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const cr = entry.contentRect;
      if (cr.width === window.innerWidth) {
        chrome.storage.local.get(['opacity'], (result) => {
          const o = result.opacity || 100;
          const opacity = o / 100;
          hercules.style.zIndex = 9999;
          hercules.style.position = 'fixed';
          hercules.style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;
          hercules.style.top = '10px';
          hercules.style.left = '10px';
          hercules.style.backdropFilter = 'blur(10px)';
        });
        const header = document.querySelector('#yt_ai_summary_header');
        makeElementDraggable(header, hercules);
      } else if (!document.fullscreenElement) {
        hercules.style.zIndex = null;
        hercules.style.position = null;
        hercules.style.top = null;
        hercules.style.backgroundColor = null;
        hercules.style.backdropFilter = null;
      }
    }
  });
    // 开始监听播放窗口元素
  ro.observe(playerElement);
};

export default evtListenerOnScreen;
