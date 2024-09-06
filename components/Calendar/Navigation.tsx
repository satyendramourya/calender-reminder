import { getUserLocale } from 'get-user-locale';

import {
	getDecadeLabel,
	getBeginNext,
	// getBeginNext2,
	getBeginPrevious,
	// getBeginPrevious2,
	getEndPrevious,
	// getEndPrevious2,
} from '../../utils/dates';
import { formatMonthYear as defaultFormatMonthYear, formatYear as defaultFormatYear } from '../../utils/dateFormater';

import type { Action, NavigationLabelFunc, RangeType } from '../../utils/types';
import { Button } from '@/components/ui/button';

type NavigationProps = {
	activeStartDate: Date;
	drillUp: () => void;

	formatMonthYear?: typeof defaultFormatMonthYear;

	formatYear?: typeof defaultFormatYear;

	locale?: string;

	maxDate?: Date;

	minDate?: Date;

	navigationAriaLabel?: string;

	navigationAriaLive?: 'off' | 'polite' | 'assertive';

	navigationLabel?: NavigationLabelFunc;

	next2AriaLabel?: string;

	next2Label?: React.ReactNode;

	nextAriaLabel?: string;

	nextLabel?: React.ReactNode;

	prev2AriaLabel?: string;

	prev2Label?: React.ReactNode;

	prevAriaLabel?: string;

	prevLabel?: React.ReactNode;
	setActiveStartDate: (nextActiveStartDate: Date, action: Action) => void;

	showDoubleView?: boolean;

	view: RangeType;
	views: string[];
};

export default function Navigation({
	activeStartDate,
	drillUp,
	formatMonthYear = defaultFormatMonthYear,
	formatYear = defaultFormatYear,
	locale,
	maxDate,
	minDate,
	navigationAriaLabel = '',
	// navigationAriaLive,
	navigationLabel,
	// next2AriaLabel = '',
	// next2Label = '»',
	// nextAriaLabel = '',
	nextLabel = '›',
	// prev2AriaLabel = '',
	// prev2Label = '«',
	// prevAriaLabel = '',
	prevLabel = '‹',
	setActiveStartDate,
	showDoubleView,
	view,
	views,
}: NavigationProps): React.ReactElement {
	const drillUpAvailable = views.indexOf(view) > 0;
	// const shouldShowPrevNext2Buttons = view !== 'century';

	const previousActiveStartDate = getBeginPrevious(view, activeStartDate);
	// const previousActiveStartDate2 = shouldShowPrevNext2Buttons ? getBeginPrevious2(view, activeStartDate) : undefined;
	const nextActiveStartDate = getBeginNext(view, activeStartDate);
	// const nextActiveStartDate2 = shouldShowPrevNext2Buttons ? getBeginNext2(view, activeStartDate) : undefined;

	const prevButtonDisabled = (() => {
		if (previousActiveStartDate.getFullYear() < 0) {
			return true;
		}
		const previousActiveEndDate = getEndPrevious(view, activeStartDate);
		return minDate && minDate >= previousActiveEndDate;
	})();

	// const prev2ButtonDisabled =
	// 	shouldShowPrevNext2Buttons &&
	// 	(() => {
	// 		if ((previousActiveStartDate2 as Date).getFullYear() < 0) {
	// 			return true;
	// 		}
	// 		const previousActiveEndDate = getEndPrevious2(view, activeStartDate);
	// 		return minDate && minDate >= previousActiveEndDate;
	// 	})();

	const nextButtonDisabled = maxDate && maxDate < nextActiveStartDate;

	// const next2ButtonDisabled = shouldShowPrevNext2Buttons && maxDate && maxDate < (nextActiveStartDate2 as Date);

	function onClickPrevious() {
		setActiveStartDate(previousActiveStartDate, 'prev');
	}

	// function onClickPrevious2() {
	// 	setActiveStartDate(previousActiveStartDate2 as Date, 'prev2');
	// }

	function onClickNext() {
		setActiveStartDate(nextActiveStartDate, 'next');
	}

	// function onClickNext2() {
	// 	setActiveStartDate(nextActiveStartDate2 as Date, 'next2');
	// }

	function renderLabel(date: Date) {
		const label = (() => {
			switch (view) {
				case 'decade':
					return getDecadeLabel(locale, formatYear, date);
				case 'year':
					return formatYear(locale, date);
				case 'month':
					return formatMonthYear(locale, date);
				default:
					throw new Error(`Invalid view: ${view}.`);
			}
		})();

		return navigationLabel
			? navigationLabel({
					date,
					label,
					locale: locale || getUserLocale() || undefined,
					view,
			  })
			: label;
	}

	return (
		<div
			// className={clsx(' flex items-center justify-between w-full  gap-10 mx-auto   ')}
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				width: '100%',
				margin: '0 auto',
				maxWidth: '340px',
			}}
		>
			<div>
				{prevLabel !== null && (
					<Button
						variant={'outline'}
						// aria-label={prevAriaLabel}
						disabled={prevButtonDisabled}
						onClick={onClickPrevious}
					>
						{prevLabel}
					</Button>
				)}
			</div>

			<div className=''>
				<Button
					size={'lg'}
					aria-label={navigationAriaLabel}
					// aria-live={navigationAriaLive}
					disabled={!drillUpAvailable}
					onClick={drillUp}
					// type='button'
				>
					<span>{renderLabel(activeStartDate)}</span>
					{showDoubleView ? (
						<>
							<span> – </span>
							<span>{renderLabel(nextActiveStartDate)}</span>
						</>
					) : null}
				</Button>
			</div>

			<div>
				{nextLabel !== null && (
					<Button
						variant={'outline'}
						// aria-label={nextAriaLabel}
						disabled={nextButtonDisabled}
						onClick={onClickNext}
						type='button'
					>
						{nextLabel}
					</Button>
				)}
			</div>
		</div>
	);
}
