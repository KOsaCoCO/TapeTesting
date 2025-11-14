// Responsive 5-column layout helper for desktop screens
// Usage:
// 1) Include this module in your page: <script type="module" src="desktop_size.js"></script>
// 2) Add a container with class `five-column` and put item elements inside it.
// 3) Optionally call `initFiveColumn(selector, options)` to customize behavior.

export function initFiveColumn(containerSelector = '.five-column', opts = {}) {
	const minColWidth = opts.minColumnWidth || 160; // minimum column width in px
	const maxColumns = opts.maxColumns || 5; // try to keep up to 5 columns on wide screens
	const aspectRatio = opts.aspectRatio || 0.75; // height / width for items

	const containers = Array.from(document.querySelectorAll(containerSelector));
	if (!containers.length) return null;

	function applyTo(container) {
		const width = Math.max(0, container.clientWidth || container.getBoundingClientRect().width);
		// compute how many columns will fit, but cap at maxColumns and at least 1
		let cols = Math.min(maxColumns, Math.max(1, Math.floor(width / minColWidth)));

		container.style.display = 'grid';
		container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
		container.style.gap = container.style.gap || getComputedStyle(container).getPropertyValue('--gap') || '16px';
		// expose aspect ratio to CSS via a custom property
		container.style.setProperty('--five-aspect-ratio', String(aspectRatio));
	}

	function applyAll() {
		containers.forEach(c => applyTo(c));
	}

	// observe container size changes to update columns dynamically
	let ro = null;
	if (typeof ResizeObserver !== 'undefined') {
		ro = new ResizeObserver(entries => {
			for (const e of entries) applyTo(e.target);
		});
		containers.forEach(c => ro.observe(c));
	} else {
		// fallback: window resize
		window.addEventListener('resize', applyAll, { passive: true });
	}

	// initial apply
	applyAll();

	return { refresh: applyAll, observer: ro };
}

// Auto-initialize on pages that include `.five-column`
if (typeof window !== 'undefined') {
	window.addEventListener('DOMContentLoaded', () => {
		if (document.querySelector('.five-column')) initFiveColumn('.five-column');
	});
}

// CSS styles migrated to display and css/desktop.css

