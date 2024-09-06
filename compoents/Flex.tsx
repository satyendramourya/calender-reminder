import { Children, cloneElement, ReactElement } from 'react';

type FlexProps = React.HTMLAttributes<HTMLDivElement> & {
	children: React.ReactElement<HTMLDivElement>[];
	className?: string;
	count: number;
	direction?: 'row' | 'column';
	offset?: number;
	wrap?: boolean;
	cols?: number;
};

function toPercent(num: number): string {
	return `${num}%`;
}

const Flex = ({
	children,
	className,
	count,
	direction,
	style,
	wrap,
	cols = 7,
	...otherProps
}: FlexProps): React.ReactElement => {
	return (
		<div
			className={className}
			style={{
				display: 'grid',
				gap: '4px',
				gridTemplateColumns: `repeat(${cols}, 1fr)`,
				flexDirection: direction,
				flexWrap: wrap ? 'wrap' : 'nowrap',
				...style,
			}}
			{...otherProps}
		>
			{Children.map(children, (child) => {
				// const marginInlineStart = offset && index === 0 ? toPercent((100 * offset) / count) : null;

				return cloneElement(child as ReactElement, {
					...child.props,
					style: {
						display: 'grid',
						columnSpan: 'all',
						gap: '4px',
						flexBasis: toPercent(100 / count),
						flexShrink: '0',
						flexGrow: '0',
						overflow: 'hidden',
						alignSelf: 'center',
						// marginLeft: marginInlineStart != null ? `${marginInlineStart}` : '',
						// marginInlineStart: marginInlineStart != null ? marginInlineStart.toString() : '',
						marginInlineEnd: '0',
					} as React.CSSProperties,
				});
			})}
		</div>
	);
};

export default Flex;
