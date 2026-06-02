export function useSwipeBack(onSwipeCallback, options = {}) {
	const {
		thresholdX = 60,
		thresholdY = 60,
		edgeWidth = 100,
		timeLimit = 400,
		ignoreSelector = ''
	} = options;

	let touchStartX = 0;
	let touchStartY = 0;
	let startTime = 0;

	const handleTouchStart = (e) => {
		touchStartX = e.touches[0].clientX;
		touchStartY = e.touches[0].clientY;
		startTime = Date.now();
	};
	const handleTouchMove = (e) => {
		if (ignoreSelector && e.target.closest(ignoreSelector)) return;
	};

	const handleTouchEnd = (e) => {
		if (ignoreSelector && e.target.closest(ignoreSelector)) return;
		if (edgeWidth !== null && touchStartX > edgeWidth) return;
		const touchEndX = e.changedTouches[0].clientX;
		const touchEndY = e.changedTouches[0].clientY;
		const timeTaken = Date.now() - startTime;

		const deltaX = touchEndX - touchStartX;
		const deltaY = Math.abs(touchEndY - touchStartY);
		if (
			deltaX > thresholdX &&
			deltaX > deltaY &&
			deltaY < thresholdY &&
			timeTaken < timeLimit
		) {
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