'use client';

import React, { forwardRef, useCallback, useImperativeHandle, useState } from 'react';

import type {
	Action,
	CalendarType,
	Detail,
	LooseValue,
	NavigationLabelFunc,
	OnArgs,
	OnClickFunc,
	OnClickWeekNumberFunc,
	Range,
	TileContentFunc,
	TileDisabledFunc,
	Value,
	View,
} from '../utils/types';

import type {
	formatDay as defaultFormatDay,
	formatLongDate as defaultFormatLongDate,
	formatMonth as defaultFormatMonth,
	formatMonthYear as defaultFormatMonthYear,
	formatShortWeekday as defaultFormatShortWeekday,
	formatWeekday as defaultFormatWeekday,
	formatYear as defaultFormatYear,
} from '../utils/dateFormater';
import { getBegin, getBeginNext, getEnd } from '@/utils/dates';
import { between } from '@/utils/utils';
import MonthView from './MonthView';
import clsx from 'clsx';
import Navigation from './Calendar/Navigation';
import YearView from './YearView';
import DecadeView from './DecadeView';

const allViews = ['decade', 'year', 'month'] as const;
const allValueTypes = ['decade', 'year', 'month', 'day'] as const;

const defaultMinDate = new Date();
defaultMinDate.setFullYear(1, 0, 1);
defaultMinDate.setHours(0, 0, 0, 0);
const defaultMaxDate = new Date(8.64e15);

export type CalendarProps = {
	activeStartDate?: Date;

	allowPartialRange?: boolean;

	calendarType?: CalendarType;

	defaultActiveStartDate?: Date;

	defaultValue?: LooseValue;

	defaultView?: View;

	formatDay?: typeof defaultFormatDay;

	formatLongDate?: typeof defaultFormatLongDate;

	formatMonth?: typeof defaultFormatMonth;

	formatMonthYear?: typeof defaultFormatMonthYear;

	formatShortWeekday?: typeof defaultFormatShortWeekday;

	formatWeekday?: typeof defaultFormatWeekday;

	formatYear?: typeof defaultFormatYear;

	goToRangeStartOnSelect?: boolean;

	inputRef?: React.Ref<HTMLDivElement>;

	locale?: string;

	maxDate?: Date;

	maxDetail?: Detail;

	minDate?: Date;

	minDetail?: Detail;

	navigationAriaLabel?: string;

	navigationAriaLive?: 'off' | 'polite' | 'assertive';

	navigationLabel?: NavigationLabelFunc;

	next2AriaLabel?: string;

	next2Label?: React.ReactNode;

	nextAriaLabel?: string;

	nextLabel?: React.ReactNode;

	onActiveStartDateChange?: ({ action, activeStartDate, value, view }: OnArgs) => void;

	onChange?: (value: Value, event: React.MouseEvent<HTMLButtonElement>) => void;

	onClickDay?: OnClickFunc;

	onClickDecade?: OnClickFunc;

	onClickMonth?: OnClickFunc;

	onClickWeekNumber?: OnClickWeekNumberFunc;

	onClickYear?: OnClickFunc;

	onDrillDown?: ({ action, activeStartDate, value, view }: OnArgs) => void;

	onDrillUp?: ({ action, activeStartDate, value, view }: OnArgs) => void;

	onViewChange?: ({ action, activeStartDate, value, view }: OnArgs) => void;

	prev2AriaLabel?: string;

	prev2Label?: React.ReactNode;

	prevAriaLabel?: string;

	prevLabel?: React.ReactNode;

	returnValue?: 'start' | 'end' | 'range';

	selectRange?: boolean;

	showDoubleView?: boolean;

	showFixedNumberOfWeeks?: boolean;

	showNavigation?: boolean;

	showNeighboringCentury?: boolean;

	showNeighboringDecade?: boolean;

	showNeighboringMonth?: boolean;

	showWeekNumbers?: boolean;

	tileContent?: TileContentFunc | React.ReactNode;

	tileDisabled?: TileDisabledFunc;

	value?: LooseValue;

	view?: View;
};

function toDate(value: Date | string): Date {
	if (value instanceof Date) {
		return value;
	}

	return new Date(value);
}

function getLimitedViews(minDetail: Detail, maxDetail: Detail) {
	return allViews.slice(allViews.indexOf(minDetail), allViews.indexOf(maxDetail) + 1);
}

function isViewAllowed(view: Detail, minDetail: Detail, maxDetail: Detail) {
	const views = getLimitedViews(minDetail, maxDetail);

	return views.indexOf(view) !== -1;
}

function getView(view: View | undefined, minDetail: Detail, maxDetail: Detail): View {
	if (!view) {
		return maxDetail;
	}

	if (isViewAllowed(view, minDetail, maxDetail)) {
		return view;
	}

	return maxDetail;
}

function getValueType<T extends number>(view: (typeof allViews)[T]): (typeof allValueTypes)[T] {
	const index = allViews.indexOf(view) as T;

	return allValueTypes[index];
}

function getValue(value: LooseValue | undefined, index: 0 | 1): Date | null {
	const rawValue = Array.isArray(value) ? value[index] : value;

	if (!rawValue) {
		return null;
	}

	const valueDate = toDate(rawValue);

	if (Number.isNaN(valueDate.getTime())) {
		throw new Error(`Invalid date: ${value}`);
	}

	return valueDate;
}

type DetailArgs = {
	value?: LooseValue;
	minDate?: Date;
	maxDate?: Date;
	maxDetail: Detail;
};

function getDetailValue({ value, minDate, maxDate, maxDetail }: DetailArgs, index: 0 | 1) {
	const valuePiece = getValue(value, index);

	if (!valuePiece) {
		return null;
	}

	const valueType = getValueType(maxDetail);

	const detailValueFrom = (() => {
		switch (index) {
			case 0:
				return getBegin(valueType, valuePiece);
			case 1:
				return getEnd(valueType, valuePiece);
			default:
				throw new Error(`Invalid index value: ${index}`);
		}
	})();

	return between(detailValueFrom, minDate, maxDate);
}

const getDetailValueFrom = (args: DetailArgs) => getDetailValue(args, 0);

const getDetailValueTo = (args: DetailArgs) => getDetailValue(args, 1);

const getDetailValueArray = (args: DetailArgs) =>
	[getDetailValueFrom, getDetailValueTo].map((fn) => fn(args)) as [
		ReturnType<typeof getDetailValueFrom>,
		ReturnType<typeof getDetailValueTo>,
	];

function getActiveStartDate({
	maxDate,
	maxDetail,
	minDate,
	minDetail,
	value,
	view,
}: DetailArgs & {
	minDetail: Detail;
	view?: View;
}) {
	const rangeType = getView(view, minDetail, maxDetail);
	const valueFrom =
		getDetailValueFrom({
			value,
			minDate,
			maxDate,
			maxDetail,
		}) || new Date();

	return getBegin(rangeType, valueFrom);
}

function getInitialActiveStartDate({
	activeStartDate,
	defaultActiveStartDate,
	defaultValue,
	defaultView,
	maxDate,
	maxDetail,
	minDate,
	minDetail,
	value,
	view,
}: {
	activeStartDate?: Date;
	defaultActiveStartDate?: Date;
	defaultValue?: LooseValue;
	defaultView?: View;
	maxDate: Date;
	maxDetail: Detail;
	minDate: Date;
	minDetail: Detail;
	value?: LooseValue;
	view?: View;
}) {
	const rangeType = getView(view, minDetail, maxDetail);
	const valueFrom = activeStartDate || defaultActiveStartDate;

	if (valueFrom) {
		return getBegin(rangeType, valueFrom);
	}

	return getActiveStartDate({
		maxDate,
		maxDetail,
		minDate,
		minDetail,
		value: value || defaultValue,
		view: view || defaultView,
	});
}

function getIsSingleValue<T>(value: T | T[]): value is T {
	return value && (!Array.isArray(value) || value.length === 1);
}

function areDatesEqual(date1?: Date | null, date2?: Date | null) {
	return date1 instanceof Date && date2 instanceof Date && date1.getTime() === date2.getTime();
}

/**
 * Calendar component for displaying and selecting dates.
 *
 * @component
 * @example
 * ```tsx
 * <Calendar
 *   activeStartDate={new Date()}
 *   allowPartialRange={false}
 *   calendarType="ISO 8601"
 *   defaultActiveStartDate={new Date()}
 *   defaultValue={null}
 *   defaultView="month"
 *   formatDay={(date) => date.getDate().toString()}
 *   formatLongDate={(date) => date.toDateString()}
 *   formatMonth={(date) => date.toLocaleString('default', { month: 'long' })}
 *   formatMonthYear={(date) => date.toLocaleString('default', { month: 'long', year: 'numeric' })}
 *   formatShortWeekday={(date) => date.toLocaleString('default', { weekday: 'short' })}
 *   formatWeekday={(date) => date.toLocaleString('default', { weekday: 'long' })}
 *   formatYear={(date) => date.getFullYear().toString()}
 *   goToRangeStartOnSelect={true}
 *   inputRef={null}
 *   locale="en-US"
 *   maxDate={null}
 *   maxDetail="month"
 *   minDate={null}
 *   minDetail="decade"
 *   navigationAriaLabel="Calendar navigation"
 *   navigationAriaLive="assertive"
 *   navigationLabel={(date, view) => `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`}
 *   next2AriaLabel="Next 2 years"
 *   next2Label=">>"
 *   nextAriaLabel="Next month"
 *   nextLabel=">"
 *   onActiveStartDateChange={(args) => console.log(args)}
 *   onChange={(value, event) => console.log(value, event)}
 *   onClickDay={(date, event) => console.log(date, event)}
 *   onClickMonth={(date, event) => console.log(date, event)}
 *   onClickWeekNumber={(weekNumber, date, event) => console.log(weekNumber, date, event)}
 *   onClickYear={(date, event) => console.log(date, event)}
 *   onDrillDown={(args) => console.log(args)}
 *   onDrillUp={(args) => console.log(args)}
 *   onViewChange={(args) => console.log(args)}
 *   prev2AriaLabel="Previous 2 years"
 *   prev2Label="<<"
 *   prevAriaLabel="Previous month"
 *   prevLabel="<"
 *   returnValue="start"
 *   selectRange={false}
 *   showDoubleView={false}
 *   showFixedNumberOfWeeks={false}
 *   showNavigation={true}
 *   showNeighboringDecade={true}
 *   showNeighboringMonth={true}
 *   showWeekNumbers={false}
 *   tileContent={null}
 *   tileDisabled={null}
 *   value={null}
 *   view={null}
 * />
 * ```
 */
const Calendar: React.ForwardRefExoticComponent<CalendarProps & React.RefAttributes<unknown>> = forwardRef(
	function Calendar(props, ref) {
		const {
			activeStartDate: activeStartDateProps,
			allowPartialRange,
			calendarType,
			defaultActiveStartDate,
			defaultValue,
			defaultView,
			formatDay,
			formatLongDate,
			formatMonth,
			formatMonthYear,
			formatShortWeekday,
			formatWeekday,
			formatYear,
			goToRangeStartOnSelect = true,
			inputRef,
			locale,
			maxDate = defaultMaxDate,
			maxDetail = 'month',
			minDate = defaultMinDate,
			minDetail = 'decade',
			navigationAriaLabel,
			navigationAriaLive,
			navigationLabel,
			next2AriaLabel,
			next2Label,
			nextAriaLabel,
			nextLabel,
			onActiveStartDateChange,
			onChange: onChangeProps,
			onClickDay,
			onClickMonth,
			onClickWeekNumber,
			onClickYear,
			onDrillDown,
			onDrillUp,
			onViewChange,
			prev2AriaLabel,
			prev2Label,
			prevAriaLabel,
			prevLabel,
			returnValue = 'start',
			selectRange,
			showDoubleView,
			showFixedNumberOfWeeks,
			showNavigation = true,
			showNeighboringDecade,
			showNeighboringMonth = true,
			showWeekNumbers,
			tileContent,
			tileDisabled,
			value: valueProps,
			view: viewProps,
		} = props;

		const [activeStartDateState, setActiveStartDateState] = useState<Date | null | undefined>(defaultActiveStartDate);
		const [hoverState, setHoverState] = useState<Date | null>(null);
		const [valueState, setValueState] = useState<Value | undefined>(
			Array.isArray(defaultValue)
				? (defaultValue.map((el) => (el !== null ? toDate(el) : null)) as Range<Date | null>)
				: defaultValue !== null && defaultValue !== undefined
				? toDate(defaultValue)
				: null,
		);
		const [viewState, setViewState] = useState<View | undefined>(defaultView);

		const activeStartDate =
			activeStartDateProps ||
			activeStartDateState ||
			getInitialActiveStartDate({
				activeStartDate: activeStartDateProps,
				defaultActiveStartDate,
				defaultValue,
				defaultView,
				maxDate,
				maxDetail,
				minDate,
				minDetail,
				value: valueProps,
				view: viewProps,
			});

		const value: Value = (() => {
			const rawValue = (() => {
				// In the middle of range selection, use value from state
				if (selectRange && getIsSingleValue(valueState)) {
					return valueState;
				}

				return valueProps !== undefined ? valueProps : valueState;
			})();

			if (!rawValue) {
				return null;
			}

			return Array.isArray(rawValue)
				? (rawValue.map((el) => (el !== null ? toDate(el) : null)) as Range<Date | null>)
				: rawValue !== null
				? toDate(rawValue)
				: null;
		})();

		const valueType = getValueType(maxDetail);

		const view = getView(viewProps || viewState, minDetail, maxDetail);

		const views = getLimitedViews(minDetail, maxDetail);

		const hover = selectRange ? hoverState : null;

		const drillDownAvailable = views.indexOf(view) < views.length - 1;

		const drillUpAvailable = views.indexOf(view) > 0;

		const getProcessedValue = useCallback(
			(value: Date) => {
				const processFunction = (() => {
					switch (returnValue) {
						case 'start':
							return getDetailValueFrom;
						case 'end':
							return getDetailValueTo;
						case 'range':
							return getDetailValueArray;
						default:
							throw new Error('Invalid returnValue.');
					}
				})();

				return processFunction({
					maxDate,
					maxDetail,
					minDate,
					value,
				});
			},
			[maxDate, maxDetail, minDate, returnValue],
		);

		const setActiveStartDate = useCallback(
			(nextActiveStartDate: Date, action: Action) => {
				setActiveStartDateState(nextActiveStartDate);

				const args: OnArgs = {
					action,
					activeStartDate: nextActiveStartDate,
					value,
					view,
				};

				if (onActiveStartDateChange && !areDatesEqual(activeStartDate, nextActiveStartDate)) {
					onActiveStartDateChange(args);
				}
			},
			[activeStartDate, onActiveStartDateChange, value, view],
		);

		const onClickTile = useCallback(
			(value: Date, event: React.MouseEvent<HTMLButtonElement>) => {
				const callback = (() => {
					switch (view) {
						case 'decade':
							return onClickYear;
						case 'year':
							return onClickMonth;
						case 'month':
							return onClickDay;
						default:
							throw new Error(`Invalid view: ${view}.`);
					}
				})();

				if (callback) callback(value, event);
			},
			[onClickDay, onClickMonth, onClickYear, view],
		);

		const drillDown = useCallback(
			(nextActiveStartDate: Date, event: React.MouseEvent<HTMLButtonElement>) => {
				if (!drillDownAvailable) {
					return;
				}

				onClickTile(nextActiveStartDate, event);

				const nextView = views[views.indexOf(view) + 1];

				if (!nextView) {
					throw new Error('Attempted to drill down from the lowest view.');
				}

				setActiveStartDateState(nextActiveStartDate);
				setViewState(nextView);

				const args: OnArgs = {
					action: 'drillDown',
					activeStartDate: nextActiveStartDate,
					value,
					view: nextView,
				};

				if (onActiveStartDateChange && !areDatesEqual(activeStartDate, nextActiveStartDate)) {
					onActiveStartDateChange(args);
				}

				if (onViewChange && view !== nextView) {
					onViewChange(args);
				}

				if (onDrillDown) {
					onDrillDown(args);
				}
			},
			[
				activeStartDate,
				drillDownAvailable,
				onActiveStartDateChange,
				onClickTile,
				onDrillDown,
				onViewChange,
				value,
				view,
				views,
			],
		);

		const drillUp = useCallback(() => {
			if (!drillUpAvailable) {
				return;
			}

			const nextView = views[views.indexOf(view) - 1];

			if (!nextView) {
				throw new Error('Attempted to drill up from the highest view.');
			}

			const nextActiveStartDate = getBegin(nextView, activeStartDate);

			setActiveStartDateState(nextActiveStartDate);
			setViewState(nextView);

			const args: OnArgs = {
				action: 'drillUp',
				activeStartDate: nextActiveStartDate,
				value,
				view: nextView,
			};

			if (onActiveStartDateChange && !areDatesEqual(activeStartDate, nextActiveStartDate)) {
				onActiveStartDateChange(args);
			}

			if (onViewChange && view !== nextView) {
				onViewChange(args);
			}

			if (onDrillUp) {
				onDrillUp(args);
			}
		}, [activeStartDate, drillUpAvailable, onActiveStartDateChange, onDrillUp, onViewChange, value, view, views]);

		const onChange = useCallback(
			(rawNextValue: Date, event: React.MouseEvent<HTMLButtonElement>) => {
				const previousValue = value;

				onClickTile(rawNextValue, event);

				const isFirstValueInRange = selectRange && !getIsSingleValue(previousValue);

				let nextValue: Value;
				if (selectRange) {
					// Range selection turned on

					if (isFirstValueInRange) {
						nextValue = rawNextValue;
						console.log('nextValue', nextValue);
					} else {
						if (!previousValue) {
							throw new Error('previousValue is required');
						}

						if (Array.isArray(previousValue)) {
							throw new Error('previousValue must not be an array');
						}

						// Second value
						console.log('previousValue', rawNextValue);
						nextValue = [previousValue, rawNextValue];

						console.log('nextValue', nextValue);
					}
				} else {
					// Range selection turned off
					nextValue = getProcessedValue(rawNextValue);
				}

				const nextActiveStartDate =
					// Range selection turned off
					!selectRange ||
					// Range selection turned on, first value
					isFirstValueInRange ||
					// Range selection turned on, second value, goToRangeStartOnSelect toggled on
					goToRangeStartOnSelect
						? getActiveStartDate({
								maxDate,
								maxDetail,
								minDate,
								minDetail,
								value: nextValue,
								view,
						  })
						: null;

				event.persist();

				setActiveStartDateState(nextActiveStartDate);
				setValueState(nextValue);

				const args: OnArgs = {
					action: 'onChange',
					activeStartDate: nextActiveStartDate,
					value: nextValue,
					view,
				};

				if (onActiveStartDateChange && !areDatesEqual(activeStartDate, nextActiveStartDate)) {
					onActiveStartDateChange(args);
				}

				if (onChangeProps) {
					if (selectRange) {
						const isSingleValue = getIsSingleValue(nextValue);

						if (!isSingleValue) {
							onChangeProps(nextValue || null, event);
						} else if (allowPartialRange) {
							if (Array.isArray(nextValue)) {
								throw new Error('value must not be an array');
							}

							onChangeProps([nextValue || null, null], event);
						}
					} else {
						onChangeProps(nextValue || null, event);
					}
				}
			},
			[
				activeStartDate,
				allowPartialRange,
				getProcessedValue,
				goToRangeStartOnSelect,
				maxDate,
				maxDetail,
				minDate,
				minDetail,
				onActiveStartDateChange,
				onChangeProps,
				onClickTile,
				selectRange,
				value,
				valueType,
				view,
			],
		);

		function onMouseOver(nextHover: Date) {
			setHoverState(nextHover);
		}

		function onMouseLeave() {
			setHoverState(null);
		}

		useImperativeHandle(
			ref,
			() => ({
				activeStartDate,
				drillDown,
				drillUp,
				onChange,
				setActiveStartDate,
				value,
				view,
			}),
			[activeStartDate, drillDown, drillUp, onChange, setActiveStartDate, value, view],
		);

		function renderContent(next?: boolean) {
			const currentActiveStartDate = next ? getBeginNext(view, activeStartDate) : getBegin(view, activeStartDate);

			const onClick = drillDownAvailable ? drillDown : onChange;

			const commonProps = {
				activeStartDate: currentActiveStartDate,
				hover,
				locale,
				maxDate,
				minDate,
				onClick,
				onMouseOver: selectRange ? onMouseOver : undefined,
				tileContent,
				tileDisabled,
				value,
				valueType,
			};

			switch (view) {
				case 'decade': {
					return <DecadeView formatYear={formatYear} showNeighboringDecade={showNeighboringDecade} {...commonProps} />;
				}
				case 'year': {
					return <YearView formatMonth={formatMonth} formatMonthYear={formatMonthYear} {...commonProps} />;
				}
				case 'month': {
					return (
						<MonthView
							calendarType={calendarType}
							formatDay={formatDay}
							formatLongDate={formatLongDate}
							formatShortWeekday={formatShortWeekday}
							formatWeekday={formatWeekday}
							onClickWeekNumber={onClickWeekNumber}
							onMouseLeave={selectRange ? onMouseLeave : undefined}
							showFixedNumberOfWeeks={
								typeof showFixedNumberOfWeeks !== 'undefined' ? showFixedNumberOfWeeks : showDoubleView
							}
							showNeighboringMonth={showNeighboringMonth}
							showWeekNumbers={showWeekNumbers}
							{...commonProps}
						/>
					);
				}
				default:
					throw new Error(`Invalid view: ${view}.`);
			}
		}

		return (
			<div
				className={clsx(' flex flex-col gap-10  ', {
					' flex-col-reverse': showDoubleView,
				})}
				ref={inputRef}
				style={{
					paddingRight: '40px',
				}}
			>
				{showNavigation && (
					<Navigation
						activeStartDate={activeStartDate}
						drillUp={drillUp}
						formatMonthYear={formatMonthYear}
						formatYear={formatYear}
						locale={locale}
						maxDate={maxDate}
						minDate={minDate}
						navigationAriaLabel={navigationAriaLabel}
						navigationAriaLive={navigationAriaLive}
						navigationLabel={navigationLabel}
						next2AriaLabel={next2AriaLabel}
						next2Label={next2Label}
						nextAriaLabel={nextAriaLabel}
						nextLabel={nextLabel}
						prev2AriaLabel={prev2AriaLabel}
						prev2Label={prev2Label}
						prevAriaLabel={prevAriaLabel}
						prevLabel={prevLabel}
						setActiveStartDate={setActiveStartDate}
						showDoubleView={showDoubleView}
						view={view}
						views={views}
					/>
				)}

				<div
					onBlur={selectRange ? onMouseLeave : undefined}
					onMouseLeave={selectRange ? onMouseLeave : undefined}
					style={{
						display: 'flex',
						gap: '20px',
						alignItems: 'flex-center',
						maxWidth: '340px',
						flexDirection: showDoubleView ? 'column' : 'row',
					}}
				>
					{renderContent()}
					{showDoubleView ? renderContent(true) : null}
				</div>
			</div>
		);
	},
);

export default Calendar;
