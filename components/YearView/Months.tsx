import { getMonthStart, getYear } from '@wojtekmaj/date-utils';
import TileGroup from '../TileGroup';
import Month from './Month';

type MonthsProps = {
	/**
	 * The beginning of a period that shall be displayed.
	 *
	 * @example new Date(2017, 0, 1)
	 */
	activeStartDate: Date;
} & Omit<React.ComponentProps<typeof TileGroup>, 'dateTransform' | 'dateType' | 'end' | 'renderTile' | 'start'> &
	Omit<React.ComponentProps<typeof Month>, 'classes' | 'date'>;

/**
 * Renders a year view with months.
 *
 * @param props - The component props.
 * @returns The rendered React element.
 */
export default function Months(props: MonthsProps): React.ReactElement {
	const { activeStartDate, hover, value, valueType, ...otherProps } = props;
	const start = 0;
	const end = 11;
	const year = getYear(activeStartDate);

	return (
		<TileGroup
			cols={3}
			className='react-calendar__year-view__months'
			dateTransform={(monthIndex) => {
				const date = new Date();
				date.setFullYear(year, monthIndex, 1);
				return getMonthStart(date);
			}}
			dateType='month'
			end={end}
			hover={hover}
			renderTile={({ date, ...otherTileProps }) => (
				<Month key={date.getTime()} {...otherProps} {...otherTileProps} activeStartDate={activeStartDate} date={date} />
			)}
			start={start}
			value={value}
			valueType={valueType}
		/>
	);
}
