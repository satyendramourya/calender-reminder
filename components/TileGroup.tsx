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

/**
 * Renders a group of tiles based on the provided props.
 *
 * @param className - The CSS class name for the tile group.
 * @param count - The number of tiles to render.
 * @param dateTransform - A function that transforms a point into a date.
 * @param dateType - The type of date to be used.
 * @param end - The end point for generating tiles.
 * @param hover - The hover state of the tiles.
 * @param offset - The offset for the tiles.
 * @param renderTile - A function that renders a single tile.
 * @param start - The start point for generating tiles.
 * @param step - The step value for generating tiles.
 * @param value - The value of the tiles.
 * @param valueType - The type of value to be used.
 * @param cols - The number of columns in the tile group.
 *
 * @returns The rendered tile group as a React element.
 */
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
