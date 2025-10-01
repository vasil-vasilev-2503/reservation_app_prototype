// @ts-ignore
import mysql from 'mysql2/promise';

// @ts-ignore
import {db} from './server.ts';

//Данните в базата са локални за всеки компютър -> трябва да си създадете базата данни и таблиците. Използва се MySQL

//Структура на таблицата за акаунтите mysql> desc accounts;
// +----------+--------------+------+-----+---------+----------------+
// | Field    | Type         | Null | Key | Default | Extra          |
// +----------+--------------+------+-----+---------+----------------+
// | username | varchar(100) | NO   | UNI | NULL    |                |
// | password | varchar(255) | NO   |     | NULL    |                |
// | email    | varchar(255) | YES  |     | NULL    |                |
// | id       | int          | NO   | PRI | NULL    | auto_increment |
// +----------+--------------+------+-----+---------+----------------+
// 4 rows in set (0.02 sec)

//Структура на таблицата за резервациите mysql> desc bookings;
// +---------------+--------------+------+-----+---------+----------------+
// | Field         | Type         | Null | Key | Default | Extra          |
// +---------------+--------------+------+-----+---------+----------------+
// | starting_date | date         | NO   |     | NULL    |                |
// | ending_date   | date         | NO   |     | NULL    |                |
// | phone_number  | varchar(100) | NO   |     | NULL    |                |
// | id            | int          | NO   | PRI | NULL    | auto_increment |
// | username      | varchar(255) | NO   | MUL | NULL    |                |
// +---------------+--------------+------+-----+---------+----------------+
// 5 rows in set (0.00 sec)


//Функции за заявки към базата данни

export async function loginDatabase(hashedPassword: string, username: string): Promise<boolean> {
    const [rows] = await db.query<any>('SELECT password FROM accounts WHERE username = ?', [username]);
    if (rows === 0) {
        return false
    }
    return hashedPassword === rows[0].password;
}

export async function registerDatabase(hashedPassword: string, username: string, email: string): Promise<boolean> {
    const result: any = await db.execute('INSERT INTO accounts (username, password, email) VALUES (?, ?, ?)', [username, hashedPassword, email]);
    return result[0].affectedRows >= 1;
}

export async function emailFetchDatabase(username: string): Promise<string> {
    const [rows] = await db.query<any>('SELECT email from accounts WHERE username = ?', [username]);
    if (rows.length === 0) {
        return "";
    }
    return rows[0].email;
}

export async function passwordChangeDatabase(hashedPassword: string, username: string): Promise<boolean> {
    const result: any = await db.execute("UPDATE accounts SET password = ? WHERE username = ?", [hashedPassword, username])
    return result[0].affectedRows >= 1;
}

export async function getAllUsersDatabase(): Promise<string[]> {
    const [rows] = await db.query<any>("SELECT * FROM bookings")
    if (rows.length === 0) {
        return []
    }
    return rows;
}

export async function reservedDatesDatabase(): Promise<Date[]> {
    const [rows] = await db.query<any>('SELECT starting_date, ending_date FROM bookings');
    if (rows.length === 0) {
        return [];
    }
    const dates_list: Date[] = [];
    rows.forEach((row: { starting_date: string, ending_date: string }) => {
        let startDate: Date = new Date(row.starting_date);
        let endDate: Date = new Date(row.ending_date);
        while (startDate <= endDate) {
            dates_list.push(new Date(startDate));
            startDate.setDate(startDate.getDate() + 1);
        }
    });
    return (dates_list);
}


export async function bookingDatabase(startingDate: Date, endingDate: Date, phoneNumber: string, username: string): Promise<boolean> {
    const startingDateFormatted: string = startingDate.toISOString().slice(0, 19).replace("T", " ");
    const endingDateFormatted: string = endingDate.toISOString().slice(0, 19).replace("T", " ");
    const result: any = await db.execute('INSERT INTO bookings (starting_date, ending_date, phone_number, username) VALUES (?, ?, ?, ?)', [startingDateFormatted, endingDateFormatted, phoneNumber, username])
    return result[0].affectedRows >= 1;
}




