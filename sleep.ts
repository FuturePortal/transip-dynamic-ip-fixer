type SleepUnit = 'miliseconds' | 'seconds';

export const sleep = (amount: number, unit: SleepUnit = 'miliseconds'): Promise<void> =>
	new Promise((resolve) => {
		setTimeout(() => resolve(), unit === 'miliseconds' ? amount : amount * 1000);
	});
