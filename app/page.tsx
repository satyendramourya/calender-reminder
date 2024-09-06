'use client';
import Calendar from '@/compoents/Calendar';
import { Value } from '@/utils/types';
import { useState } from 'react';

export default function Home() {
	const [selectedDate, setSelectedDate] = useState<Value>(null);

	const onClickDay = (value: Value) => {
		setSelectedDate(value);
	};

	return (
		<div className='flex flex-col gap-10 items-center justify-center '>
			<h1 className='text-xl font-bold mt-[10dvh] text-blue-400'>Calender component</h1>

			<Calendar onClickDay={onClickDay} />
			<p>Selected date: {selectedDate ? selectedDate.toString() : 'none'}</p>
		</div>
	);
}
