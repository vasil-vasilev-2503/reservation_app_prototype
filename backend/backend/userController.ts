import {UserModel} from "./UserModel";

const userModel = new UserModel(); // Създаване на UserModel обект

//Клас UserController - вика функции от клас модел

export class UserController {
    async controllerLogin(hashedPassword: string, username: string){
        return await userModel.modelLogin(hashedPassword, username);
    };

    async controllerRegister(hashedPassword: string, username: string, email: string){
        return await userModel.modelRegister(hashedPassword, username, email);
    };

    async controllerEmailFetch(username: string) {
        return await userModel.modelEmailFetch(username);
    }

    async controllerPasswordChange(hashedPassword: string, username: string){
        return await userModel.modelPasswordChange(hashedPassword, username);
    };

    async controllerGetAllUsers() {
        return await userModel.modelGetAllUsers();
    }

    async reservedDatesController(){
        return await userModel.reservedDatesModel();
    };

    async bookingController(startingDate: Date, endingDate: Date, phoneNumber: string, username: string){
        return await userModel.bookingModel(startingDate, endingDate, phoneNumber, username);
    };
}