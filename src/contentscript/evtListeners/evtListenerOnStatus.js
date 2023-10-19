const evtListenerOnStatus = () => {
  const trackBtn = document.getElementById('hercules_track');
  const pauseIcon = document.querySelector('svg[data-icon="pause"]');
  const startIcon = document.querySelector('svg[data-icon="start"]');

  trackBtn.addEventListener('click', (e) => {
    const ytVideoEl = document.querySelector('#movie_player > div.html5-video-container > video');
    e.preventDefault();
    e.stopPropagation();
    if (ytVideoEl.paused) {
      pauseIcon.style.display = 'block';
      startIcon.style.display = 'none';
      ytVideoEl.play();
    } else {
      startIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
      ytVideoEl.pause();
    }
  });
};

export default evtListenerOnStatus;
