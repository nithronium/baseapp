export const isValidDate = (date: string, dateToCheck: string | number | Date) => {
    const [day, month, year] = date.split('/');
    const inputDate = new Date(`${month}/${day}/${year}`);
    const formattedDateToCheck = new Date(dateToCheck);

    return inputDate > formattedDateToCheck;
};
