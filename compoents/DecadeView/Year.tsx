import { getYearStart, getYearEnd, getDecadeStart } from '@wojtekmaj/date-utils';

import { formatYear as defaultFormatYear } from '../../utils/dateFormater';
import Tile from '../Tile';

const className = 'react-calendar__decade-view__years__year';

type YearProps = {
	classes?: string[];
	currentDecade: number;

	formatYear?: typeof defaultFormatYear;
} & Omit<React.ComponentProps<typeof Tile>, 'children' | 'maxDateTransform' | 'minDateTransform' | 'view'>;

export default function Year({
	classes = [],
	currentDecade,
	formatYear = defaultFormatYear,
	...otherProps
}: YearProps): React.ReactElement {
	const { date, locale } = otherProps;

	const classesProps: string[] = [];

	if (classes) {
		classesProps.push(...classes);
	}

	if (className) {
		classesProps.push(className);
	}

	if (getDecadeStart(date).getFullYear() !== currentDecade) {
		classesProps.push(`${className}--neighboringDecade`);
	}

	return (
		<Tile
			{...otherProps}
			classes={classesProps}
			maxDateTransform={getYearEnd}
			minDateTransform={getYearStart}
			view='decade'
		>
			{formatYear(locale, date)}
		</Tile>
	);
}
