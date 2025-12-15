const MS_PER_DAY = 86_400_000;

export function toUTCDateOnly(inputValue) {
	const date =
		inputValue?.toDate ? inputValue.toDate() :
			typeof inputValue === 'string'
				? (/^\d{4}-\d{2}-\d{2}$/.test(inputValue) ? new Date(inputValue + 'T00:00:00Z') : new Date(inputValue))
				: new Date(inputValue || Date.now());
	return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export function diffCalendarDaysUTC(startDate, endDate = new Date()) {
	const startDay = toUTCDateOnly(startDate);
	const endDay = toUTCDateOnly(endDate);
	return Math.floor((endDay - startDay) / MS_PER_DAY);
}
