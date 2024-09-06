import type { CALENDAR_TYPES } from './const.js';

// Represents a range of values
export type Range<T> = [T, T];

// Represents an action that can be performed
export type Action = 'prev' | 'prev2' | 'next' | 'next2' | 'onChange' | 'drillUp' | 'drillDown';

// Represents a type of calendar
export type CalendarType = (typeof CALENDAR_TYPES)[keyof typeof CALENDAR_TYPES];

// Represents a class name
export type ClassName = string | null | undefined | (string | null | undefined)[];

// Represents a detail level
export type Detail = 'decade' | 'year' | 'month';

// Represents a loose value piece, which can be a string, Date object, or null
type LooseValuePiece = string | Date | null;

// Represents a loose value, which can be a single value or a range of values
export type LooseValue = LooseValuePiece | Range<LooseValuePiece>;

// Represents a range type
export type RangeType = 'decade' | 'year' | 'month' | 'day';

// Represents a value piece, which can be a Date object or null
type ValuePiece = Date | null;

// Represents a value, which can be a single value or a range of values
export type Value = ValuePiece | Range<ValuePiece>;

// Represents a view level
export type View = 'decade' | 'year' | 'month';

// Represents the arguments for generating a navigation label
export type NavigationLabelArgs = {
    date: Date;
    label: string;
    locale: string | undefined;
    view: View;
};

// Represents a function that generates a navigation label
export type NavigationLabelFunc = ({
    date,
    label,
    locale,
    view,
}: NavigationLabelArgs) => React.ReactNode;

// Represents the arguments for an event handler
export type OnArgs = {
    action: Action;
    activeStartDate: Date | null;
    value: Value;
    view: View;
};

// Represents a function that handles onClick events
export type OnClickFunc = (value: Date, event: React.MouseEvent<HTMLButtonElement>) => void;

// Represents a function that handles onClick events for week numbers
export type OnClickWeekNumberFunc = (
    weekNumber: number,
    date: Date,
    event: React.MouseEvent<HTMLButtonElement>,
) => void;

// Represents the arguments for generating a tile
export type TileArgs = {
    activeStartDate: Date;
    date: Date;
    view: View;
};

// Represents a function that generates a tile class name
export type TileClassNameFunc = (args: TileArgs) => ClassName;

// Represents a function that generates tile content
export type TileContentFunc = (args: TileArgs) => React.ReactNode;

// Represents a function that determines if a tile is disabled
export type TileDisabledFunc = (args: TileArgs) => boolean;
