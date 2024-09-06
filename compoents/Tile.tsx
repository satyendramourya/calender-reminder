'use client';

import { useMemo } from 'react';
import clsx from 'clsx';

import React from 'react';
import { ClassName, TileClassNameFunc, TileContentFunc, TileDisabledFunc, View } from '@/utils/types';
import { Button } from '@/components/ui/button';

type TileProps = {
	activeStartDate: Date;
	children: React.ReactNode;
	classes?: string[];
	date: Date;
	formatAbbr?: (locale: string | undefined, date: Date) => string;
	locale?: string;
	maxDate?: Date;
	maxDateTransform: (date: Date) => Date;
	minDate?: Date;
	minDateTransform: (date: Date) => Date;
	onClick?: (date: Date, event: React.MouseEvent<HTMLButtonElement>) => void;
	onMouseOver?: (date: Date) => void;
	style?: React.CSSProperties;

	tileClassName?: TileClassNameFunc | ClassName;

	tileContent?: TileContentFunc | React.ReactNode;
	tileDisabled?: TileDisabledFunc;
	view: View;
};

const Tile = (props: TileProps): React.ReactElement => {
	const {
		activeStartDate,
		children,
		classes,
		date,
		formatAbbr,
		locale,
		maxDate,
		maxDateTransform,
		minDate,
		minDateTransform,
		onClick,
		onMouseOver,
		tileClassName: tileClassNameProps,
		tileContent: tileContentProps,
		tileDisabled,
		view,
	} = props;

	const tileClassName = useMemo(() => {
		const args = { activeStartDate, date, view };

		return typeof tileClassNameProps === 'function' ? tileClassNameProps(args) : tileClassNameProps;
	}, [activeStartDate, date, tileClassNameProps, view]);

	const tileContent = useMemo(() => {
		const args = { activeStartDate, date, view };

		return typeof tileContentProps === 'function' ? tileContentProps(args) : tileContentProps;
	}, [activeStartDate, date, tileContentProps, view]);

	return (
		<Button
			variant={date.toDateString() === new Date().toDateString() ? 'today' : 'ghost'}
			className={clsx(classes, tileClassName)}
			disabled={
				(minDate && minDateTransform(minDate) > date) ||
				(maxDate && maxDateTransform(maxDate) < date) ||
				tileDisabled?.({ activeStartDate, date, view })
			}
			onClick={onClick ? (event) => onClick(date, event) : undefined}
			onFocus={onMouseOver ? () => onMouseOver(date) : undefined}
			onMouseOver={onMouseOver ? () => onMouseOver(date) : undefined}
		>
			{formatAbbr ? <abbr aria-label={formatAbbr(locale, date)}>{children}</abbr> : children}
			{tileContent}
		</Button>
	);
};

export default Tile;
