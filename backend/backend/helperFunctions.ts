//Функция за валидиране на парола
export function passwordValidation(password: string) {
    return password.length >= 7;
}

//Функция за нормализиране на дати(използват се в api функциите свързани с резервации)
export function normalizeDate(date: Date): Date {
    const normalizedDate = new Date(date);
    normalizedDate.setUTCHours(0, 0, 0, 0);
    return normalizedDate;
}