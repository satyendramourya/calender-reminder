import { CalendarType } from '@/utils/types';
import React from 'react';

import { formatDay as defaultFormatDay, formatLongDate as defaultFormatLongDate } from '@/utils/dateFormater';
import Tile from '../Tile';
import { isWeekend } from '@/utils/dates';
import { getDayEnd, getDayStart } from '@wojtekmaj/date-utils';

const className = 'react-calendar__month-view__days__day';
const style: React.CSSProperties = {};

type DayProps = {
	classes: string[];
	currentMonthIndex: number;

	calendarType: CalendarType | undefined;
	formatDay?: typeof defaultFormatDay;
	formatLongDate?: typeof defaultFormatLongDate;
} & Omit<
	React.ComponentProps<typeof Tile>,
	'children' | 'formatAbbr' | 'maxDateTransform' | 'minDateTransform' | 'view'
>;

const Day = ({
	calendarType,
	classes = [],
	currentMonthIndex,
	formatDay = defaultFormatDay,
	formatLongDate = defaultFormatLongDate,
	...otherProps
}: DayProps): React.ReactElement => {
	const { date, locale } = otherProps;

	const classesProps: string[] = [];

	if (classes) {
		classesProps.push(...classes);
	}

	if (className) {
		classesProps.push(className);
	}

	if (isWeekend(date, calendarType)) {
		// classesProps.push(`${className}--weekend`);
		style.backgroundColor = 'red';
		style.color = 'white';
		style.borderRadius = '50%';
		style.padding = '1rem';
		style.width = '2rem';
	}

	if (date.getMonth() !== currentMonthIndex) {
		classesProps.push(`${className}--neighboringMonth`);
	}

	return (
		<Tile
			style={{ ...style }}
			{...otherProps}
			formatAbbr={formatLongDate}
			maxDateTransform={getDayEnd}
			minDateTransform={getDayStart}
			view='month'
		>
			{formatDay(locale, date)}
		</Tile>
	);
};

export default Day;
