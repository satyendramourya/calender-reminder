import { getBeginOfWeek, getDayOfWeek, getWeekNumber } from '@/utils/dates';
import { CalendarType, OnClickWeekNumberFunc } from '@/utils/types';
import { getDate, getDaysInMonth, getMonth, getYear } from '@wojtekmaj/date-utils';
import React from 'react';
import Flex from '../Flex';
import WeekNumber from './WeekNumber';

type WeekNumbersProps = {
	activeStartDate: Date;
	calendarType: CalendarType;
	onClickWeekNumber?: OnClickWeekNumberFunc;
	onMouseLeave?: () => void;

	showFixedNumberOfWeeks?: boolean;
};

/**
 * Renders the week numbers for the month view.
 *
 * @param {WeekNumbersProps} props - The component props.
 * @returns {JSX.Element} The rendered WeekNumbers component.
 */
const WeekNumbers = (props: WeekNumbersProps) => {
	const { activeStartDate, calendarType, onClickWeekNumber, onMouseLeave, showFixedNumberOfWeeks } = props;

	const numberOfWeeks = (() => {
		if (showFixedNumberOfWeeks) {
			return 6;
		}

		const numberOfDays = getDaysInMonth(activeStartDate);
		const startWeekday = getDayOfWeek(activeStartDate, calendarType);

		const days = numberOfDays - (7 - startWeekday);
		return 1 + Math.ceil(days / 7);
	})();

	const dates = (() => {
		const year = getYear(activeStartDate);
		const monthIndex = getMonth(activeStartDate);
		const day = getDate(activeStartDate);

		const results = [];

		for (let index = 0; index < numberOfWeeks; index += 1) {
			results.push(getBeginOfWeek(new Date(year, monthIndex, day + index * 7), calendarType));
		}
		return results;
	})();

	const weekNumbers = dates.map((date) => getWeekNumber(date, calendarType));

	return (
		<Flex
			className='react-calendar__month-view__weekNumbers'
			count={numberOfWeeks}
			direction='column'
			onFocus={onMouseLeave}
			onMouseOver={onMouseLeave}
			style={{ flexBasis: 'calc(100% * (1 / 8)', flexShrink: 0 }}
		>
			{weekNumbers.map((weekNumber, weekIndex) => {
				const date = dates[weekIndex];
				if (!date) {
					throw new Error('date is not defined');
				}

				return (
					<WeekNumber key={weekNumber} date={date} onClickWeekNumber={onClickWeekNumber} weekNumber={weekNumber} />
				);
			})}
		</Flex>
	);
};

export default WeekNumbers;
