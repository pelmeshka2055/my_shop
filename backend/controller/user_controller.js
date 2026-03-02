// import db from '../db.js';
// import bcrypt from 'bcrypt';

// class UserController {
//     async createUser(req, res) {
//         try {
//             const { name, email, password } = req.body;
//             let { balance } = req.body;

//             if (!name || !email || !password) {
//                 return res.status(400).json("Missing fields");
//             }

//             // Хешируем пароль
//             const hashedPassword = await bcrypt.hash(password, 10);

//             if (balance === null || balance === undefined) {
//                 balance = 0;
//             } else {
//                 balance = Number(balance);
//             }

//             const newPerson = await db.query(
//                 'INSERT INTO person (name, email, password, balance) VALUES ($1, $2, $3, $4) RETURNING *',
//                 [name, email, hashedPassword, balance]
//             );

//             res.json(newPerson.rows[0]);

//         } catch (e) {
//             console.log(e);
//             res.status(500).json("Server error");
//         }    }
//     async loginUser(req, res) {
//         try {
//             const { email, password } = req.body;

//             if (!email || !password) {
//                 return res.status(400).json("Missing email or password");
//             }

//             // ищем пользователя
//             const result = await db.query(
//                 'SELECT * FROM person WHERE email = $1',
//                 [email]
//             );

//             const user = result.rows[0];

//             // сравниваем пароль
//             const isMatch = await bcrypt.compare(password, user.password);

//             if (!isMatch) {
//                 return res.status(400).json("Wrong password");
//             }

//             // можно вернуть пользователя (без пароля!)
//             const { password: _, ...userData } = user;

//             res.json({
//                 message: "Login successful",
//                 user: userData
//             });

//         } catch (e) {
//             console.log(e);
//             res.status(500).json("Server error");
//         }
//     }

//     async getUsers(req, res) {
//         const users = await db.query('SELECT * FROM person');
//         res.json(users.rows);
//     }

//     async getOneUser(req, res) {
//         const id = req.params.id;
//         const user = await db.query('SELECT * FROM person WHERE id = $1', [id]);
//         res.json(user.rows[0]);
//     }

//     async updateUser(req, res) {
//         const id = req.params.id;
//         const{name, email, password} = req.body;
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const user = await db.query("UPDATE person SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *",
//             [name, email, hashedPassword, id]);
//         res.json(user.rows[0]);
        

//     }

//     async deleteUser(req, res) {
//         const id = req.params.id;
//         const user = await db.query('DELETE FROM person WHERE id = $1 RETURNING *', [id]);
//         res.json(user.rows[0]);
//     }
// }

// export default new UserController();
