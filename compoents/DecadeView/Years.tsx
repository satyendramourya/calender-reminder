import { getYearStart } from '@wojtekmaj/date-utils';

import TileGroup from '../TileGroup';
import Year from './Year';
import { getBeginOfDecadeYear } from '../../utils/dates';

type YearsProps = {
	activeStartDate: Date;

	showNeighboringDecade?: boolean;
} & Omit<React.ComponentProps<typeof TileGroup>, 'dateTransform' | 'dateType' | 'end' | 'renderTile' | 'start'> &
	Omit<React.ComponentProps<typeof Year>, 'classes' | 'currentDecade' | 'date'>;

export default function Years(props: YearsProps): React.ReactElement {
	const { activeStartDate, hover, showNeighboringDecade, value, valueType, ...otherProps } = props;
	const start = getBeginOfDecadeYear(activeStartDate);
	const end = start + (showNeighboringDecade ? 11 : 9);

	return (
		<TileGroup
			cols={3}
			className='react-calendar__decade-view__years'
			dateTransform={getYearStart}
			dateType='year'
			end={end}
			hover={hover}
			renderTile={({ date, ...otherTileProps }) => (
				<Year
					key={date.getTime()}
					{...otherProps}
					{...otherTileProps}
					activeStartDate={activeStartDate}
					currentDecade={start}
					date={date}
				/>
			)}
			start={start}
			value={value}
			valueType={valueType}
		/>
	);
}
