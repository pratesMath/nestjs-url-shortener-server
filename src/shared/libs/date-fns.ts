import * as DateFns from 'date-fns';

export const dateFns = DateFns;

export function setDateToBrazilianFormat(date: string | Date | number) {
	return dateFns.format(String(date), 'dd/MM/yyy HH:mm:ss');
}
