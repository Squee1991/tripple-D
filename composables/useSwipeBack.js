export function useSwipeBack(onSwipeCallback, options = {}) {
	const {
		thresholdX = 80,
		thresholdY = 40,
		ignoreSelector = '.options-container'
	} = options;

	let touchStartX = 0;
	let touchStartY = 0;

	const handleTouchStart = (e) => {
		touchStartX = e.touches[0].clientX;
		touchStartY = e.touches[0].clientY;
	};
	const handleTouchMove = (e) => {
		if (ignoreSelector && e.target.closest(ignoreSelector)) return;
	};
	const handleTouchEnd = (e) => {
		if (ignoreSelector && e.target.closest(ignoreSelector)) return;
		const touchEndX = e.changedTouches[0].clientX;
		const touchEndY = e.changedTouches[0].clientY;
		const deltaX = touchEndX - touchStartX;
		const deltaY = Math.abs(touchEndY - touchStartY);
		if (deltaX > thresholdX && deltaY < thresholdY) {
			if (typeof onSwipeCallback === 'function') {
				onSwipeCallback();
			}
		}
	};

	return {
		handleTouchStart,
		handleTouchMove,
		handleTouchEnd
	};
}