import type { CalendarType } from './types';

export const CALENDAR_TYPES = {
    GREGORY: 'gregory',
    HEBREW: 'hebrew',
    ISLAMIC: 'islamic',
    ISO_8601: 'iso8601',
} as const;

/**
 * Represents a mapping of calendar types to their corresponding locales.
 * @remarks
 * The `CALENDAR_TYPE_LOCALES` object is used to store the supported locales for each calendar type.
 * Each calendar type is represented as a key in the object, and the corresponding value is an array of locale strings.
 * 
 * @example
 * ```typescript
 * const supportedLocales = CALENDAR_TYPE_LOCALES.gregory;
 * // supportedLocales: ['en-CA', 'en-US', 'es-AR', ...]
 * ```
 */
export const CALENDAR_TYPE_LOCALES: Partial<Record<CalendarType, string[]>> = {
    gregory: [
        'en-CA',
        'en-US',
        'es-AR',
        'es-BO',
        'es-CL',
        'es-CO',
        'es-CR',
        'es-DO',
        'es-EC',
        'es-GT',
        'es-HN',
        'es-MX',
        'es-NI',
        'es-PA',
        'es-PE',
        'es-PR',
        'es-SV',
        'es-VE',
        'pt-BR',
    ],
    hebrew: ['he', 'he-IL'],
    islamic: [
        // ar-LB, ar-MA intentionally missing
        'ar',
        'ar-AE',
        'ar-BH',
        'ar-DZ',
        'ar-EG',
        'ar-IQ',
        'ar-JO',
        'ar-KW',
        'ar-LY',
        'ar-OM',
        'ar-QA',
        'ar-SA',
        'ar-SD',
        'ar-SY',
        'ar-YE',
        'dv',
        'dv-MV',
        'ps',
        'ps-AR',
    ],
};

export const WEEKDAYS = [0, 1, 2, 3, 4, 5, 6] as const;
