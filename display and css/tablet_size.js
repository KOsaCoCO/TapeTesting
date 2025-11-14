// Tablet / three-column layout helper
// Keeps items in three equal columns on tablet viewports and exposes CSS variables
// for button height, font-size and padding so tablet controls match desktop and phone
// proportions. Designed to sit between the desktop and phone helpers.
// Usage:
// import { initTabletThreeColumn } from './tablet_size.js'
// initTabletThreeColumn('.five-column', { minTabletWidth: 481, maxTabletWidth: 1024, aspectRatio: 0.75 })

export function initTabletThreeColumn(containerSelector = '.five-column', opts = {}) {
  const aspectRatio = opts.aspectRatio || 0.75;
  const minTabletWidth = opts.minTabletWidth || 481; // px (just above typical phone)
  const maxTabletWidth = opts.maxTabletWidth || 1024; // px
  const buttonHeight = opts.buttonHeight || 48; // tablet touch target (px)
  const minFontSize = opts.minFontSize || 15; // px
  const columns = opts.columns || 3;

  const containers = Array.from(document.querySelectorAll(containerSelector));
  if (!containers.length) return null;

  function applyTo(container) {
    const width = Math.max(0, container.clientWidth || container.getBoundingClientRect().width);

    // If container width falls in tablet range, enforce 3 columns.
    if (width >= minTabletWidth && width <= maxTabletWidth) {
      container.style.display = 'grid';
      container.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
      container.style.gap = container.style.gap || getComputedStyle(container).getPropertyValue('--gap') || '16px';
      // keep aspect ratio consistent with desktop/phone helpers
      container.style.setProperty('--five-aspect-ratio', String(aspectRatio));
      // expose tablet-specific sizing variables to keep controls consistent
      container.style.setProperty('--tablet-button-height', `${buttonHeight}px`);
      container.style.setProperty('--tablet-min-font-size', `${minFontSize}px`);
      const pad = Math.max(10, Math.round(width * 0.02));
      container.style.setProperty('--tablet-item-padding', `${pad}px`);
    } else {
      // If not in tablet width, don't override grid columns — let phone or desktop helpers manage.
      // Still ensure the aspect-ratio variable is present for consistency.
      container.style.setProperty('--five-aspect-ratio', String(aspectRatio));
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

  applyAll();

  return { refresh: applyAll, observer: ro };
}

// Auto-initialize on DOMContentLoaded if a `.five-column` container exists.
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.five-column')) initTabletThreeColumn('.five-column');
  });
}

// CSS styles migrated to display and css/tablet.css

