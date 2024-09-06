import { OnClickWeekNumberFunc } from '@/utils/types';
import React from 'react';

const className = 'react-calendar__title';

type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> & {
	onClickWeekNumber: OnClickWeekNumberFunc;
};

type DivProps = React.HTMLAttributes<HTMLDivElement> & {
	onClickWeekNumber?: undefined;
};

type WeekNumberProps<T = OnClickWeekNumberFunc | undefined> = (T extends OnClickWeekNumberFunc
	? ButtonProps
	: DivProps) & {
	date: Date;
	weekNumber: number;
};

/**
 * Represents a component that displays a week number.
 * @component
 */
const WeekNumber = (props: WeekNumberProps) => {
	const { onClickWeekNumber, weekNumber } = props;

	const children = <span>{weekNumber}</span>;

	if (onClickWeekNumber) {
		const { date, onClickWeekNumber, weekNumber, ...ohterProps } = props;
		return (
			<button
				{...ohterProps}
				className={className}
				onClick={(event) => onClickWeekNumber(weekNumber, date, event)}
				type='button'
			>
				{children}
			</button>
		);
	} else {
		const { ...otherProps } = props;

		return (
			<div {...otherProps} className={className}>
				{children}
			</div>
		);
	}
};

export default WeekNumber;
