import clsx from 'clsx';

import { CALENDAR_TYPE_LOCALES, CALENDAR_TYPES } from '../utils/const';
import { CalendarType } from '@/utils/types';
import Weekdays from './MonthView/Weekdays';
import WeekNumbers from './MonthView/WeekNumbers';
import Days from './MonthView/Days';

function getCalendarTypeFromLocale(locale: string | undefined): CalendarType {
	if (locale) {
		for (const [calendarType, locales] of Object.entries(CALENDAR_TYPE_LOCALES)) {
			if (locales.includes(locale)) {
				return calendarType as CalendarType;
			}
		}
	}

	return CALENDAR_TYPES.ISO_8601;
}

type MonthViewProps = {
	calendarType?: CalendarType;

	showWeekNumbers?: boolean;
} & Omit<
	React.ComponentProps<typeof Weekdays> & React.ComponentProps<typeof WeekNumbers> & React.ComponentProps<typeof Days>,
	'calendarType'
>;

/**
 * Renders a month view component.
 *
 * @param props - The props for the MonthView component.
 * @returns A React element representing the month view.
 */
export default function MonthView(props: MonthViewProps): React.ReactElement {
	const { activeStartDate, locale, onMouseLeave, showFixedNumberOfWeeks } = props;
	const {
		calendarType = getCalendarTypeFromLocale(locale),
		formatShortWeekday,
		formatWeekday,
		onClickWeekNumber,
		showWeekNumbers,
		...childProps
	} = props;

	const className = 'react-calendar__month-view';

	return (
		<div className={clsx(className, showWeekNumbers ? `${className}--weekNumbers` : '')}>
			<div
				style={{
					display: 'flex',
					alignItems: 'flex-end',
				}}
			>
				{showWeekNumbers && (
					<WeekNumbers
						activeStartDate={activeStartDate}
						calendarType={calendarType}
						onClickWeekNumber={onClickWeekNumber}
						showFixedNumberOfWeeks={showFixedNumberOfWeeks}
					/>
				)}
				<div
					style={{
						flexGrow: 1,
						width: '100%',
					}}
				>
					<Weekdays
						calendarType={calendarType}
						formatShortWeekday={formatShortWeekday}
						formatWeekday={formatWeekday}
						locale={locale}
						onMouseLeave={onMouseLeave}
					/>
					<Days calendarType={calendarType} {...childProps} />
				</div>
			</div>
		</div>
	);
}
