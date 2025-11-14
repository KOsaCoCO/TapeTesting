// Phone / one-column layout helper
// Keeps items in a single column on narrow viewports and exposes CSS variables
// for consistent dimensions (button height, font-size, padding) so mobile
// items keep the same visual proportions as the desktop layout.
// Usage:
// import { initPhoneOneColumn } from './phone_size.js'
// initPhoneOneColumn('.five-column', { maxPhoneWidth: 480, aspectRatio: 0.75 })

export function initPhoneOneColumn(containerSelector = '.five-column', opts = {}) {
  const aspectRatio = opts.aspectRatio || 0.75;
  const maxPhoneWidth = opts.maxPhoneWidth || 480; // px threshold for phone
  const buttonHeight = opts.buttonHeight || 44; // recommended touch target (px)
  const minFontSize = opts.minFontSize || 14; // px

  const containers = Array.from(document.querySelectorAll(containerSelector));
  if (!containers.length) return null;

  function applyTo(container) {
    const width = Math.max(0, container.clientWidth || container.getBoundingClientRect().width);
    if (width <= maxPhoneWidth) {
      container.style.display = 'grid';
      container.style.gridTemplateColumns = '1fr';
      container.style.gap = container.style.gap || getComputedStyle(container).getPropertyValue('--gap') || '12px';
      // keep aspect ratio consistent with desktop
      container.style.setProperty('--five-aspect-ratio', String(aspectRatio));
      // expose helpful phone-specific sizing variables
      container.style.setProperty('--phone-button-height', `${buttonHeight}px`);
      container.style.setProperty('--phone-min-font-size', `${minFontSize}px`);
      // item padding scales slightly with width to keep touch targets balanced
      const pad = Math.max(8, Math.round(width * 0.03));
      container.style.setProperty('--phone-item-padding', `${pad}px`);
    }
  }

  function applyAll() {
    containers.forEach(c => applyTo(c));
  }

  let ro = null;
  if (typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(entries => {
      for (const e of entries) applyTo(e.target);
    });
    containers.forEach(c => ro.observe(c));
  } else {
    window.addEventListener('resize', applyAll, { passive: true });
  }

  // initial apply
  applyAll();

  return { refresh: applyAll, observer: ro };
}

// Auto-initialize on DOMContentLoaded if a `.five-column` container exists.
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.five-column')) initPhoneOneColumn('.five-column');
  });
}

// CSS styles migrated to display and css/phone.css

