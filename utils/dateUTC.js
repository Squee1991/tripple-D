const MS_PER_DAY = 86_400_000;

export function toUTCDateOnly(x) {
	const d =
		x?.toDate ? x.toDate() :
			typeof x === 'string'
				? (/^\d{4}-\d{2}-\d{2}$/.test(x) ? new Date(x + 'T00:00:00Z') : new Date(x))
				: new Date(x || Date.now());
	return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

export function diffCalendarDaysUTC(start, end = new Date()) {
	const s = toUTCDateOnly(start);
	const e = toUTCDateOnly(end);
	return Math.floor((e - s) / MS_PER_DAY);
}
