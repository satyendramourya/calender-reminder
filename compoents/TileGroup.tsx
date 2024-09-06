import { getTileClasses } from '@/utils/utils';
import React from 'react';
import Flex from './Flex';
import { RangeType, Value } from '@/utils/types';

type TileGroupProps = {
	cols?: number;
	className?: string;
	count?: number;
	dateTransform: (point: number) => Date;
	dateType: RangeType;
	end: number;
	hover?: Date | null;
	offset?: number;
	renderTile: (props: { classes: string[]; date: Date }) => React.ReactElement;
	start: number;
	step?: number;
	value?: Value;
	valueType: RangeType;
};

const TileGroup = ({
	className,
	count = 3,
	dateTransform,
	dateType,
	end,
	hover,
	offset,
	renderTile,
	start,
	step = 1,
	value,
	valueType,
	cols = 7,
}: TileGroupProps): React.ReactElement => {
	const tiles = [];

	for (let point = start; point <= end; point += step) {
		const date = dateTransform(point);

		tiles.push(
			renderTile({
				classes: getTileClasses({
					date,
					dateType,
					hover,
					value,
					valueType,
				}),
				date,
			}),
		);
	}
	return (
		<Flex cols={cols} className={className} count={count} offset={offset} wrap>
			{tiles}
		</Flex>
	);
};

export default TileGroup;
