import { getMonthStart, getMonthEnd } from '@wojtekmaj/date-utils';

import { formatMonth as defaultFormatMonth, formatMonthYear as defaultFormatMonthYear } from '../../utils/dateFormater';
import Tile from '../Tile';

const className = 'react-calendar__year-view__months__month';

type MonthProps = {
	classes?: string[];

	formatMonth?: typeof defaultFormatMonth;

	formatMonthYear?: typeof defaultFormatMonthYear;
} & Omit<
	React.ComponentProps<typeof Tile>,
	'children' | 'formatAbbr' | 'maxDateTransform' | 'minDateTransform' | 'view'
>;

/**
 * Renders a month tile in the year view of the calendar component.
 *
 * @param classes - Additional CSS classes to apply to the month tile.
 * @param formatMonth - Function to format the month name.
 * @param formatMonthYear - Function to format the month and year.
 * @param otherProps - Other props passed to the component.
 * @param otherProps.date - The date of the month tile.
 * @param otherProps.locale - The locale to use for formatting the month name.
 * @returns The rendered month tile.
 */
export default function Month({
	classes = [],
	formatMonth = defaultFormatMonth,
	formatMonthYear = defaultFormatMonthYear,
	...otherProps
}: MonthProps): React.ReactElement {
	const { date, locale } = otherProps;

	return (
		<Tile
			{...otherProps}
			classes={[...classes, className]}
			formatAbbr={formatMonthYear}
			maxDateTransform={getMonthEnd}
			minDateTransform={getMonthStart}
			view='year'
		>
			{formatMonth(locale, date)}
		</Tile>
	);
}
