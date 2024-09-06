'use client';
import Calendar from '@/components/Calendar';
import { Value } from '@/utils/types';
import { useState } from 'react';

import { addReminder, removeReminder, selectReminders } from '@/lib/reminder-slice';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

/**
 * Represents the Home component.
 *
 * This component displays a calendar and allows users to add reminders for specific dates.
 * Reminders can include a note and a time.
 *
 * @returns The rendered Home component.
 */
export default function Home() {
	const [selectedDate, setSelectedDate] = useState<Value>(null);
	const [note, setNote] = useState('');
	const [time, setTime] = useState('12:00');
	const [showDoubleView, setShowDoubleView] = useState(false);
	const [selectRange, setSelectRange] = useState(false);

	const dispatch = useAppDispatch();

	const onChange = (value: Value) => {
		selectRange && setSelectedDate(value);
	};

	const reminders = useAppSelector(selectReminders);

	const generateRandomId = () => {
		return Math.floor(100 + Math.random() * 900).toString();
	};

	const formatDate = (date: Date) => {
		return date
			.toLocaleDateString('en-GB', {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit',
			})
			.replace(/\//g, '-');
	};

	const formatDateTime = (date: Date) => {
		const formattedDate = formatDate(date);
		const formattedTime = date.toLocaleTimeString('en-GB', {
			hour: '2-digit',
			minute: '2-digit',
		});
		return `${formattedDate}/${formattedTime}`;
	};

	const formatDateRange = (range: [string, string]) => {
		const [start, end] = range;
		const formattedStart = formatDate(new Date(start));
		const formattedEnd = formatDate(new Date(end));
		return `${formattedStart}/${formattedEnd}`;
	};

	const onClickDay = (value: Value) => {
		setSelectedDate(value);
	};

	return (
		<div className='flex flex-col md:flex-row gap-10 items-center justify-center  max-w-screen-xl mx-auto'>
			<div className='flex items-center justify-center flex-col gap-10 w-full'>
				<div className='flex items-center justify-between mt-[10dvh] gap-4'>
					<h1 className='text-xl font-bold  text-blue-400'>Calender component</h1>
					<Button
						variant={showDoubleView ? 'secondary' : 'default'}
						onClick={() => {
							setShowDoubleView(!showDoubleView);
						}}
					>
						Double
					</Button>
					<Button
						variant={selectRange ? 'secondary' : 'default'}
						onClick={() => {
							setSelectRange(!selectRange);
						}}
					>
						Range
					</Button>
				</div>

				<Calendar
					onClickDay={onClickDay}
					returnValue='range'
					showDoubleView={showDoubleView}
					selectRange={selectRange}
					onChange={onChange}
				/>

				<div className='flex gap-2 items-start justify-start max-w-sm mx-auto  flex-col w-full font-semibold text-lg text-blue-400'>
					<div className='flex gap-4 w-full'>
						<p>Date:</p>
						<Input
							type='text'
							className='border-none bg-slate-500/20'
							placeholder='Date'
							// value={selectedDate instanceof Date ? formatDate(selectedDate) : ''}

							value={
								selectedDate instanceof Date
									? formatDate(selectedDate)
									: Array.isArray(selectedDate)
									? formatDateRange(selectedDate as unknown as [string, string])
									: ''
							}
						/>
					</div>

					<div className='flex gap-4 w-full'>
						<p>Note:</p>
						<Textarea
							className='border-none min-w-[215px] bg-slate-500/20'
							placeholder='Add a reminder'
							value={note}
							onChange={(e) => setNote(e.target.value)}
						/>
					</div>
					<div className='flex gap-4 w-full'>
						<p>Time:</p>
						<Input
							type='time'
							value={time}
							className='border-none bg-slate-500/20 min-w-[215px]'
							onChange={(e) => setTime(e.target.value)}
						/>
					</div>

					<Button
						variant={'secondary'}
						size={'lg'}
						className='w-full'
						onClick={() => {
							if (selectedDate === null || note === '' || time === '') {
								return;
							}
							const reminder = {
								id: generateRandomId(),
								date:
									selectedDate instanceof Date
										? formatDate(selectedDate)
										: formatDateRange(selectedDate as unknown as [string, string]),
								text: note,
								time: time,
								creationTime: formatDateTime(new Date()),
							};

							dispatch(addReminder(reminder));
							setNote('');
							setTime('12:00');
						}}
					>
						Add reminder
					</Button>
				</div>
			</div>

			<div className='flex flex-col gap-4 w-full items-start justify-start min-h-[500px] p-4'>
				<p className='text-xl font-bold  text-blue-400'>Reminders</p>
				{reminders.map((reminder) => {
					const [creationDate, creationTime] = reminder.creationTime ? reminder.creationTime.split('/') : ['', ''];
					return (
						<div
							key={reminder.id}
							className='grid grid-cols-5 w-full max-w-screen-sm bg-gray-700/20 p-4 rounded-ms  gap-8 items-center justify-between relative border-blue-400 border rounded-md'
						>
							<div className='col-span-3 flex flex-col gap-2'>
								<p className='text-xs  font-semibold text-blue-400'>
									{' '}
									{reminder.date.includes('/') ? reminder.date.split('/').join(' -- ') : reminder.date}
								</p>
								<p className='text-base font-semibold '>{reminder.text}</p>
							</div>
							<div className='text-blue-400 font-semibold'>
								<p className='bg-black'>{reminder.time}</p>
							</div>
							<div className='absolute  -top-1  right-0 flex gap-4 text-sm'>
								<p className='bg-black'>{creationTime}</p>
								<p className='bg-black'>{creationDate}</p>
							</div>

							<div className='flex justify-end '>
								<Button
									variant={'destructive'}
									size={'icon'}
									className='col-span-1 self-end'
									onClick={() => dispatch(removeReminder(reminder.id))}
								>
									{' '}
									<Trash2 />{' '}
								</Button>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
