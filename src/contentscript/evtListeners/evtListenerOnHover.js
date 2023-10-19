import {
  hoverLabel, hoverElement,
} from '../component';

const evtListenerOnHover = () => {
  Array.from(hoverElement).forEach((el) => {
    const label = el.getAttribute('data-hover-label');
    if (!label) { return; }
    el.addEventListener('mouseenter', (e) => {
      e.stopPropagation();
      e.preventDefault();
      Array.from(hoverLabel).forEach((ele) => { ele.remove(); });
      el.insertAdjacentHTML('beforeend', `<div class="yt_ai_header_hover_label">
                            ${label.replace(/\n+/g, '<br />')}
                        </div>`);
    });
    el.addEventListener('mouseleave', (e) => {
      e.stopPropagation();
      e.preventDefault();
      Array.from(hoverLabel).forEach((ele) => { ele.remove(); });
    });
  });
};

export default evtListenerOnHover;
