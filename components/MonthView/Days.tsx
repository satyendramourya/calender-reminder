import { getDayOfWeek } from '@/utils/dates';
import { CalendarType, OnClickFunc } from '@/utils/types';
import { getDaysInMonth, getDayStart, getMonth, getYear } from '@wojtekmaj/date-utils';
import TileGroup from '../TileGroup';
import Day from './Day';

type DaysProps = {
	activeStartDate: Date;
	calendarType: CalendarType;
	onClickDay?: OnClickFunc;

	showFixedNumberOfWeeks?: boolean;
	showNeighboringMonth?: boolean;
} & Omit<React.ComponentProps<typeof TileGroup>, 'dateTransform' | 'dateType' | 'end' | 'renderTile' | 'start'> &
	Omit<React.ComponentProps<typeof Day>, 'classes' | 'currentMonthIndex' | 'date' | 'point'>;

/**
 * Renders the days of a month in a calendar view.
 *
 * @component
 * @param {DaysProps} props - The component props.
 * @returns {React.ReactElement} The rendered component.
 */
const Days = (props: DaysProps): React.ReactElement => {
	const {
		activeStartDate,
		calendarType,
		hover,
		showFixedNumberOfWeeks,
		showNeighboringMonth,
		value,
		valueType,
		...otherProps
	} = props;

	const year = getYear(activeStartDate);
	const monthIndex = getMonth(activeStartDate);

	const hasFixedNumberOfWeeks = showFixedNumberOfWeeks || showNeighboringMonth;
	const dayOfWeek = getDayOfWeek(activeStartDate, calendarType);

	const offset = hasFixedNumberOfWeeks ? 0 : dayOfWeek;

	const start = (hasFixedNumberOfWeeks ? -dayOfWeek : 0) + 1;

	const end = (() => {
		if (showFixedNumberOfWeeks) {
			return start + 6 * 7 - 1;
		}

		const daysInMonth = getDaysInMonth(activeStartDate);

		if (showNeighboringMonth) {
			const activeEndDate = new Date();
			activeEndDate.setFullYear(year, monthIndex, daysInMonth);

			activeEndDate.setHours(0, 0, 0, 0);
			const daysUntilEndOfTheWeek = 7 - getDayOfWeek(activeEndDate, calendarType) - 1;

			return daysInMonth + daysUntilEndOfTheWeek;
		}
		return daysInMonth;
	})();

	return (
		<TileGroup
			count={7}
			dateTransform={(day) => {
				const date = new Date();
				date.setFullYear(year, monthIndex, day);
				return getDayStart(date);
			}}
			dateType='day'
			hover={hover}
			end={end}
			renderTile={({ date, ...otherTileProps }) => (
				<Day
					key={date.getTime()}
					{...otherProps}
					{...otherTileProps}
					activeStartDate={activeStartDate}
					calendarType={calendarType}
					currentMonthIndex={monthIndex}
					date={date}
				/>
			)}
			offset={offset}
			start={start}
			value={value}
			valueType={valueType}
		></TileGroup>
	);
};

export default Days;
