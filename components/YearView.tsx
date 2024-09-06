import Months from './YearView/Months';

type YearViewProps = React.ComponentProps<typeof Months>;

/**
 * Displays a given year.
 */
export default function YearView(props: YearViewProps): React.ReactElement {
	return (
		<div className='react-calendar__year-view'>
			<Months {...props} />
		</div>
	);
}
