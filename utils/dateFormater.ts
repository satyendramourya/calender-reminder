import getUserLocale from "get-user-locale";

const formatterCache = new Map();

function getFormatter(options: Intl.DateTimeFormatOptions): (local: string | undefined, date: Date) => string {
    return function formatter(local: string | undefined, date: Date): string {
        const localWithDefault = local || getUserLocale();

        if (!formatterCache.has(localWithDefault)) {
            formatterCache.set(localWithDefault, new Map());
        }

        const formatterCacheLocale = formatterCache.get(localWithDefault);

        if (!formatterCacheLocale.has(options)) {
            formatterCacheLocale.set(options, new Intl.DateTimeFormat(localWithDefault || undefined, options).format);
        }

        return formatterCacheLocale.get(options)(date);
    }
}

function toSafeHour(date: Date): Date {
    const safeDate = new Date(date);
    return new Date(safeDate.setHours(12, 0, 0, 0));
}

function getSafeFormatter(
    options: Intl.DateTimeFormatOptions
): (local: string | undefined, date: Date) => string {
    return (locale, date) => getFormatter(options)(locale, toSafeHour(date));
}

const formatDateOptions = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
} satisfies Intl.DateTimeFormatOptions;
const formatDayOptions = { day: 'numeric' } satisfies Intl.DateTimeFormatOptions;
const formatLongDateOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
} satisfies Intl.DateTimeFormatOptions;
const formatMonthOptions = { month: 'long' } satisfies Intl.DateTimeFormatOptions;
const formatMonthYearOptions = {
    month: 'long',
    year: 'numeric',
} satisfies Intl.DateTimeFormatOptions;
const formatShortWeekdayOptions = { weekday: 'short' } satisfies Intl.DateTimeFormatOptions;
const formatWeekdayOptions = { weekday: 'long' } satisfies Intl.DateTimeFormatOptions;
const formatYearOptions = { year: 'numeric' } satisfies Intl.DateTimeFormatOptions;

export const formatDate: (locale: string | undefined, date: Date) => string =
    getSafeFormatter(formatDateOptions);
export const formatDay: (locale: string | undefined, date: Date) => string =
    getSafeFormatter(formatDayOptions);
export const formatLongDate: (locale: string | undefined, date: Date) => string =
    getSafeFormatter(formatLongDateOptions);
export const formatMonth: (locale: string | undefined, date: Date) => string =
    getSafeFormatter(formatMonthOptions);
export const formatMonthYear: (locale: string | undefined, date: Date) => string =
    getSafeFormatter(formatMonthYearOptions);
export const formatShortWeekday: (locale: string | undefined, date: Date) => string =
    getSafeFormatter(formatShortWeekdayOptions);
export const formatWeekday: (locale: string | undefined, date: Date) => string =
    getSafeFormatter(formatWeekdayOptions);
export const formatYear: (locale: string | undefined, date: Date) => string =
    getSafeFormatter(formatYearOptions);
