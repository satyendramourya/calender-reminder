import { CalendarType } from '@/utils/types';
import React from 'react';

import {
	formatShortWeekday as defaultFormatShortWeekday,
	formatWeekday as defaultFormatWeekday,
} from '@/utils/dateFormater';
import { getDayOfWeek } from '@/utils/dates';
import { getMonth, getMonthStart, getYear } from '@wojtekmaj/date-utils';
import Flex from '../Flex';

type WeekdaysProps = {
	calendarType: CalendarType | undefined;
	formatShortWeekday?: typeof defaultFormatShortWeekday;
	classNames?: string;
	formatWeekday?: typeof defaultFormatWeekday;
	locale?: string;
	onMouseLeave?: () => void;
};

const Weekdays = (props: WeekdaysProps): React.ReactElement => {
	const {
		calendarType,
		formatShortWeekday = defaultFormatShortWeekday,
		formatWeekday = defaultFormatWeekday,
		locale,
		onMouseLeave,
	} = props;

	const anyDate = new Date();
	const beginOfMonth = getMonthStart(anyDate);
	const year = getYear(beginOfMonth);
	const monthIndex = getMonth(beginOfMonth);

	const weekdays = [];

	for (let weekday = 1; weekday <= 7; weekday += 1) {
		const weekdayDate = new Date(year, monthIndex, weekday - getDayOfWeek(beginOfMonth, calendarType));
		const abbr = formatWeekday(locale, weekdayDate);

		weekdays.push(
			<div key={weekday}>
				<abbr aria-label={abbr} title={abbr}>
					{formatShortWeekday(locale, weekdayDate).replace('.', '')}
				</abbr>
			</div>,
		);
	}

	return (
		<Flex
			offset={0}
			count={7}
			onFocus={onMouseLeave}
			onMouseOver={onMouseLeave}
			className='font-semibold text-3xl text-blue-400'
		>
			{weekdays}
		</Flex>
	);
};

export default Weekdays;
