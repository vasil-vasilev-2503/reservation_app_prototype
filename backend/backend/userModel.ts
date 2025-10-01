import {
    bookingDatabase,
    emailFetchDatabase,
    getAllUsersDatabase,
    loginDatabase,
    passwordChangeDatabase,
    registerDatabase,
    reservedDatesDatabase
} from "../databaseQueries";

//Клас UserModel извиква функции за заявки към базата данни(функции от файла databaseQueries.ts)

export class UserModel {
    async modelLogin(hashedPassword: string, username: string) {
        return await loginDatabase(hashedPassword, username);
    };

    async modelRegister(hashedPassword: string, username: string, email: string) {
        return await registerDatabase(hashedPassword, username, email);
    };

    async modelEmailFetch(username: string) {
        return await emailFetchDatabase(username);
    }

    async modelPasswordChange(hashedPassword: string, username: string) {
        return await passwordChangeDatabase(hashedPassword, username);
    }

    async modelGetAllUsers() {
        return await getAllUsersDatabase();
    }

    async reservedDatesModel() {
        return reservedDatesDatabase();
    }

    async bookingModel(startingDate: Date, endingDate: Date, phoneNumber: string, username: string) {
        return bookingDatabase(startingDate, endingDate, phoneNumber, username);
    }
}