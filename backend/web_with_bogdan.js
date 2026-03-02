import cors from 'cors'; //для разрешения кросс-доменных запросов, чтобы фронт и бэк могли общаться, даже если они на разных доменах
import jwt from 'jsonwebtoken'; //для генерации токена
import express from 'express';
import bcrypt from 'bcrypt'; //для генерации сиоли и хеширования пароля
import {registerValidation} from './validations/auth.js'; //проверяем на соответствие требованиям
import { validationResult } from 'express-validator' //смотрит ошибки при валидации
import db from './db.js'; //для работы с базой данных
import "dotenv/config"//для того чтобы не спиздили все пароли

const app = express();
app.use(express.json());
const PORT = 5001;



// app.use(cors({
//     origin: 'http://77.222.35.84',
//     credentials: true
// }));
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', 'http://77.222.35.84');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     res.header('Access-Control-Allow-Credentials', 'true');
    
//     if (req.method === 'OPTIONS') {
//         return res.sendStatus(200);
//     }
//     next();
// });


//тут на главное странице при запросе get мы будем получать req - запрос пользователя, а res - ответ от сервера, который мы отправляем пользователю
app.get('/', (req, res) => {
    console.log(req.query);
    res.status(200).json("HELLO");
});

//тут при POST запросе мы получаем данные от пользователя
app.post('/', (req, res) => {
    console.log(req.body);
    res.status(200).json({message: "Data received"});
});


//логин
app.post('/auth/login', async(req, res) => {
    try {
        //проверка на то есть ли вообще такой пользователь
        const result = await db.query(
            'SELECT * FROM person WHERE email = $1',
            [req.body.email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Пользователь не найден" }); //ВАЖНО
        }

        //достаем пользователя из результата запроса
        const userData = result.rows[0];

        //сравниваем пароли которые нам прислали и который есть в бд.
        const isValidPassword = await bcrypt.compare(
            req.body.password,
            userData.password
        );
        //если пароль не верны то ошибка
        if (!isValidPassword){
            return res.status(400).json({message: "Неверный логин или пароль"}); 
        }

        // создаем токен 
        const token = jwt.sign({
            id: userData.id,
        }, process.env.JWT_KEY,
        {expiresIn: '30d'});

        //убираем пароль из ответа
        const { password, ...user } = userData;

        //отправляем ответ пользователю
        res.json({
            ...user,
            token,
        });

    } catch (e){
        console.log(e);
        res.status(500).json({message: "Server error, login"});
    }
});


//регистрация
app.post('/auth/register',registerValidation, async(req, res) => {
    try{
        //проверяем на ошибки валидации
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {name, email, password} = req.body;
        const balance = 0;

        //пароль и соль
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //создаем нового пользователя в базе данных
        const newPerson = await db.query(
            'INSERT INTO person (name, email, password, balance) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, hashedPassword, balance]
        );

        //убираем пароль из ответа, чтобы не отправлять его пользователю
        const { password: _, ...userData } = newPerson.rows[0];

        //создание и отправка токена
        const token = jwt.sign({
            id: userData.id,
        }, process.env.JWT_KEY,
        {expiresIn: '30d'});

        //создаем ответ, который отправляем пользователю
        res.json({
            ...userData,
            token,
        });

    } catch (e) {
        console.log(e);
        res.status(500).json({message: "Server error, register"});
    }
});


app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

// app.use('/api', userRouter);