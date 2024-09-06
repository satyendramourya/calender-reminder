import Calendar from '@/compoents/Calendar';

export default function Home() {
	return (
		<div className='flex flex-col gap-10 items-center justify-center '>
			<h1 className='text-xl font-bold mt-[10dvh] text-blue-400'>Calender component</h1>

			<Calendar />
		</div>
	);
}
