/**
 * Two-click videos in blog articles (the youtube block in posts.ts). Until the
 * reader clicks, the page has only our own box and loads nothing from
 * YouTube; the click swaps in the player from youtube-nocookie.com, allowed
 * as a frame in public/_headers and described in the privacy policy.
 */

for (const figure of document.querySelectorAll<HTMLElement>('.bl-video[data-youtube]')) {
  const box = figure.querySelector<HTMLAnchorElement>('.bl-video-box');
  const id = figure.dataset.youtube ?? '';
  if (!box || !/^[\w-]{11}$/.test(id)) continue;
  box.addEventListener('click', (e) => {
    // Opening it on YouTube in a new tab or window stays a plain link.
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    const frame = document.createElement('iframe');
    frame.className = 'bl-video-frame';
    frame.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
    frame.title = figure.dataset.title ?? '';
    frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    box.replaceWith(frame);
    frame.focus();
  });
}
