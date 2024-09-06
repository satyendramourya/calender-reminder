import { getRange } from "./dates";
import { Range, RangeType, Value } from "./types";

/**
 * Returns the value if it is within the specified range, otherwise returns the minimum or maximum value of the range.
 * @param value - The value to check.
 * @param min - The minimum value of the range.
 * @param max - The maximum value of the range.
 * @returns The value if it is within the range, otherwise the minimum or maximum value of the range.
 */
export function between<T extends Date>(value: T, min?: T | null, max?: T | null): T {
    if (min && min > value) {
        return min;
    }

    if (max && max < value) {
        return max;
    }

    return value;
}

/**
 * Checks if a value is within the specified range.
 * @param value - The value to check.
 * @param range - The range to check against.
 * @returns True if the value is within the range, otherwise false.
 */
export function isValueWithinRange(value: Date, range: Range<Date>): boolean {
    return range[0] <= value && range[1] >= value;
}

/**
 * Checks if a value or range is complete (not null).
 * @param value - The value or range to check.
 * @returns True if the value or range is complete, otherwise false.
 */
function isCompleteValue<T>(value: T | null | Range<T | null>): value is T | Range<T> {
    if (Array.isArray(value)) {
        return value[0] !== null && value[1] !== null;
    }

    return value !== null;
}

/**
 * Checks if a greater range is completely within a smaller range.
 * @param greaterRange - The greater range.
 * @param smallerRange - The smaller range.
 * @returns True if the greater range is completely within the smaller range, otherwise false.
 */
export function isRangeWithinRange(greaterRange: Range<Date>, smallerRange: Range<Date>): boolean {
    return greaterRange[0] <= smallerRange[0] && greaterRange[1] >= smallerRange[1];
}

/**
 * Checks if two ranges overlap.
 * @param range1 - The first range.
 * @param range2 - The second range.
 * @returns True if the ranges overlap, otherwise false.
 */
export function doRangesOverlap(range1: Range<Date>, range2: Range<Date>): boolean {
    return isValueWithinRange(range1[0], range2) || isValueWithinRange(range1[1], range2);
}

/**
 * Returns the class names for a given value range and date range.
 * @param valueRange - The value range.
 * @param dateRange - The date range.
 * @param baseClassName - The base class name.
 * @returns An array of class names.
 */
function getRangeClassNames(
    valueRange: Range<Date>,
    dateRange: Range<Date>,
    baseClassName: string,
): string[] {
    const isRange = doRangesOverlap(dateRange, valueRange);

    const classes = [];

    if (isRange) {
        classes.push(baseClassName);

        const isRangeStart = isValueWithinRange(valueRange[0], dateRange);
        const isRangeEnd = isValueWithinRange(valueRange[1], dateRange);

        if (isRangeStart) {
            classes.push(`${baseClassName}Start`);
        }

        if (isRangeEnd) {
            classes.push(`${baseClassName}End`);
        }

        if (isRangeStart && isRangeEnd) {
            classes.push(`${baseClassName}BothEnds`);
        }
    }

    return classes;
}

/**
 * Returns the class names for a tile based on the provided arguments.
 * @param args - The arguments object.
 * @param args.date - The date or date range.
 * @param args.dateType - The type of the date range.
 * @param args.hover - The hover date.
 * @param args.value - The value or value range.
 * @param args.valueType - The type of the value range.
 * @returns An array of class names.
 * @throws Error if args is not provided.
 */
export function getTileClasses(args: {
    date?: Date | Range<Date>;
    dateType?: RangeType;
    hover?: Date | null;
    value?: Value;
    valueType?: RangeType;
}): string[] {
    if (!args) {
        throw new Error('args is required');
    }

    const { value, date, hover } = args;

    const className = 'react-calendar__title'
    const classes = [className];

    if (!date) {
        return classes;
    }

    const now = new Date();
    const dateRange = (() => {
        if (Array.isArray((date))) {
            return date;
        }

        const { dateType } = args;

        if (!dateType) {
            throw new Error('dateType is required when date is not an array of two dates');
        }
        return getRange(dateType, date)
    })();


    if (isValueWithinRange(now, dateRange)) {
        classes.push(`${className}--now`);
    }

    if (!value || !isCompleteValue(value)) {
        return classes;
    }

    const valueRange = (() => {
        if (Array.isArray(value)) {
            return value;
        }

        const { valueType } = args;

        if (!valueType) {
            throw new Error('valueType is required when value is not an array of two dates');
        }

        return getRange(valueType, value);
    })();

    if (isRangeWithinRange(valueRange, dateRange)) {
        classes.push(`${className}--active`);
    } else if (doRangesOverlap(valueRange, dateRange)) {
        classes.push(`${className}--hasActive`);
    }

    const valueRangeClassNames = getRangeClassNames(valueRange, dateRange, `${className}--range`);

    classes.push(...valueRangeClassNames);

    const valueArray = Array.isArray(value) ? value : [value];

    if (hover && valueArray.length === 1) {
        const hoverRange: Range<Date> =
            hover > valueRange[0] ? [valueRange[0], hover] : [hover, valueRange[0]];
        const hoverRangeClassNames = getRangeClassNames(hoverRange, dateRange, `${className}--hover`);

        classes.push(...hoverRangeClassNames);
    }

    return classes;
}
