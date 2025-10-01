// @ts-ignore
import express from 'express';
// @ts-ignore
import cookieSession from 'cookie-session';
import {userRouter} from './backend/userRouter';
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql2/promise";
dotenv.config();


const app = express(); // Инициализация на express сървъра
const cookieKey: string = process.env.COOKIE_SESSION_KEY!;
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}; // Опции за cors
app.use(cors(corsOptions)); // Използване на cors с дадените опции
app.use(cookieSession({
    name: "cookie-session",
    keys: [cookieKey],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    path: '/'
})); // Дефиниране на опции за cookie сесиите
app.use(express.json()); //
app.use(express.urlencoded({ extended: true }));
app.use(express.static("C:\\Users\\ASUS\\Desktop\\semester6\\web_development\\project\\frontend")); // Използване на frontend проекта/частта.
app.use(userRouter); // Използване на импортнирания рутер от userRouter.ts
const dbPassword: string = process.env.DATABASE_PW!;
const dbName: string = process.env.DATABASE_NAME!;
const dbHost: string = process.env.DATABASE_HOST!;
const dbUser: string = process.env.DATABASE_USER!;
export const db = mysql.createPool({
    host: dbHost,
    user: dbUser,
    password: dbPassword,
    database: dbName,
    dateStrings: true
}); // Инициализиране на връзка с базата данни



app.listen(8080, () => console.log('Server running on port 8080')); // Стартиране на backend сървъра - работи на порт 8080, frontend работи на порт 5173
