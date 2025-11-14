// mongooseTimeToInfo.ts

// import "@formatjs/intl-getcanonicallocales/polyfill";
// import "@formatjs/intl-locale/polyfill";
// import "@formatjs/intl-pluralrules/polyfill-force";
// import "@formatjs/intl-relativetimeformat/polyfill";
// import "@formatjs/intl-relativetimeformat/locale-data/en";

const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

const toDate = (value: string | Date): Date => {
	const d = value instanceof Date ? value : new Date(value);
	if (Number.isNaN(d.getTime())) throw new Error("Invalid date string");
	return d;
};

const rtf =
	typeof Intl !== "undefined" && "RelativeTimeFormat" in Intl
		? new Intl.RelativeTimeFormat(undefined, {
				numeric: "always",
				style: "short",
			})
		: null;

const rel = (msDiff: number): string | null => {
	const abs = Math.abs(msDiff);
	if (abs < 30 * 1000) return "just now"; // nice UX
	if (abs < 60 * MIN)
		return rtf
			? rtf.format(Math.round(msDiff / MIN), "minute")
			: `${Math.abs(Math.round(msDiff / MIN))}min`;
	if (abs < 24 * HOUR)
		return rtf
			? rtf.format(Math.round(msDiff / HOUR), "hour")
			: `${Math.abs(Math.round(msDiff / HOUR))}h`;
	if (abs < 30 * DAY)
		return rtf
			? rtf.format(Math.round(msDiff / DAY), "day")
			: `${Math.abs(Math.round(msDiff / DAY))}d`;
	return null; // tell caller to fall back to calendar date
};

const dateFmt =
	typeof Intl !== "undefined" && "DateTimeFormat" in Intl
		? new Intl.DateTimeFormat(undefined, { dateStyle: "medium" })
		: null;

const absoluteDate = (d: Date) =>
	dateFmt ? dateFmt.format(d) : d.toISOString().slice(0, 10);

export const mongooseTimeToInfo = (
	time: string | Date,
	now: Date = new Date()
): string => {
	const d = toDate(time);
	const msDiff = d.getTime() - now.getTime(); // negative => past (so rtf prints "... ago")
	return rel(msDiff) ?? absoluteDate(d);
};
