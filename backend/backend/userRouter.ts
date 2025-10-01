import {Request, Response} from "express";
import express = require('express');
// @ts-ignore
import crypto from "crypto";
import {UserController} from "./userController";
import {passwordValidation} from "./helperFunctions";
import {normalizeDate} from "./helperFunctions";

const userController = new UserController(); // Създаване на UserController обект

export const userRouter = express.Router(); // Дефиниране на рутер - импортира се в server.ts

//API функциите викат функции от Controller клас

/*
API Функции свързани с потребител
 */

//Функция за вписване на потребител
userRouter.post("/login", async (req: Request, res: Response) => {
    const {username, password} = req.body;
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    let routerLogin: boolean = await userController.controllerLogin(hashedPassword, username);
    if (!routerLogin) {
        res.send({
            success: false,
            message: 'Login failed!'
        })
        return;
    }
    req.session = {user: {username}};
    res.send({
        success: true,
        message: 'Logged in successfully!'
    })
});

//Функция за регистрация на потребител
userRouter.post("/register", async (req: Request, res: Response) => {
    const {username, password, email} = req.body;
    if (username === "" && password === "" && email === "") {
        res.send({
            success: false,
            message: 'All profile fields are required!'
        })
        return;
    }
    if(!passwordValidation(password)) {
        res.send({
            success: false,
            message: 'The password must be at least 8 symbols long!'
        })
    }
    const hashedPassword: string = crypto.createHash('sha256').update(password).digest('hex')
    let routerGetAllUsers: string[] = await userController.controllerGetAllUsers();
    if (routerGetAllUsers.includes(username)) {
        res.send({
            success: false,
            message: "Duplicate username!"
        })
        return;
    }
    let routerRegister: boolean = await userController.controllerRegister(hashedPassword, username, email)
    if(!routerRegister) {
        res.send({
            success: false,
            message: 'Register failed!'
        })
        return;
    }
    res.send({
        success: routerRegister,
        message: "Register successfully!"
    })
});

//Функция за извличане на имейл на даден потребител - username от сесията се използва в sql заявката
userRouter.get("/user_info_fetch", async (req: Request, res: Response) => {
    if (req.session) {
        const usernameRequest = req.session.user.username;
        let emailFetchVariable: string = await userController.controllerEmailFetch(usernameRequest);
        res.send({
            success: true,
            username: usernameRequest,
            email: emailFetchVariable
        })
    } else {
        res.send({
            success: false,
        })
    }
});

//Функция за logout на потребител(нулира се cookie сесията)
userRouter.post("/logout", (req: Request, res: Response) => {
    if(!req.session?.user) {
        res.send({
            success: false
        })
        return;
    }
    if (req.session?.user) {
        req.session = null;
        res.send({
            success: true
        })
    }
});

//Функция за смяна на парола
userRouter.post("/change_password", async (req: any, res: any) => {
    if (!req.session?.user) {
        res.send({
            success: false
        })
        return;
    }
    const newPassword: string = req.body.new_password;
    const username = req.session.user.username;
    if (newPassword === "") {
        res.send({
            success: false,
            message: 'You must enter a password!'
        })
    }
    if(!passwordValidation(newPassword)) {
        res.send({
            success: false,
            message: 'The password must be at least 8 symbols long!'
        })
    }
    const hashedPassword: string = crypto.createHash('sha256').update(newPassword).digest('hex');
    let routerChangePassword: boolean = await userController.controllerPasswordChange(hashedPassword, username);
    if (routerChangePassword) {
        req.session = null;
    }
    res.send({
        success: routerChangePassword
    })
})

//Фунция за извличане на сесийни данни(извлича се потребителското име което се съхранява в cookie сесията)
userRouter.get("/user-session-data", (req: any, res: any) => {
    if (!req.session?.user) {
        return res.status(401).send("You are not logged in!");
    }
    res.json({username: req.session.user.username});
});

userRouter.get("/check-session", (req: any, res: any) => {
    res.send({
        success: !!req.session?.user,
    })
})


/*
API функции свързани с резервации
 */


//Функции за извличане на резервирани данни от базата данни - всички извлечени дати се съхраняват в лист/масив
userRouter.get("/reserved-dates", async (req: Request, res: Response) => {
    let reservedDatesControllerList: Date[] = await userController.reservedDatesController();
    if (reservedDatesControllerList.length < 0) {
        res.send({
            success: false,
            message: "Could not fetch reserved dates!"
        })
        return
    }
    res.send({
        success: true,
        datesList: reservedDatesControllerList
    })
});

//Функция за резервации
userRouter.post("/booking", async (req: any, res: any) => {
    if (!req.session?.user) {
        res.send({
            success: false,
            message: "You are not logged in!"
        })
    }
    const startDate: Date = new Date(req.body.startingDate);
    const endDate: Date = new Date(req.body.endingDate);
    const currentDate: Date = new Date();
    const phoneNumber: string = req.body.phoneNumberRequest;
    if (endDate < startDate) {
        res.send({
            success: false,
            message: "The ending date cannot be before the starting date!"
        })
        return
    }
    if (startDate < currentDate) {
        res.send({
            success: false,
            message: "The starting date cannot be before the current date!"
        })
        return;
    }
    let reservedDatesControllerList: Date[] = await userController.reservedDatesController();
    let overlap: boolean = false;
    let checkStartDate: Date = normalizeDate(new Date(startDate));
    let checkEndDate: Date = normalizeDate(new Date(endDate));
    for (checkStartDate; checkStartDate <= checkEndDate; checkStartDate.setUTCDate(checkStartDate.getUTCDate() + 1)) {
        for (let i: number = 0; i < reservedDatesControllerList.length; i++) {
            if (reservedDatesControllerList[i].getTime() === checkStartDate.getTime()) {
                overlap = true;
                break;
            }
        }
        if (overlap) break;
    }

    if (overlap) {
        res.send({
            success: false,
            message: "The booking overlaps with another booking!"
        });
        return;
    }
    const usernameRequest = req.session.user.username;
    const isBookingSuccessfull: boolean = await userController.bookingController(startDate, endDate, phoneNumber, usernameRequest);
    res.send({
        success: isBookingSuccessfull,
        message: isBookingSuccessfull ? "Booking successfully reserved!" : "Database error!"
    })
});