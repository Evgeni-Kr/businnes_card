const db = require("../database");
const User = require("../entities/User");
const bcrypt = require("bcryptjs");

module.exports = {
  async register(req, res) {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        res.writeHead(400);
        return res.end("Заполните все поля");
      }

      const existingUser =
        (await db.findUserByUsername(username)) ||
        (await db.findUserByEmail(email));

      if (existingUser) {
        res.writeHead(409);
        return res.end("Пользователь уже существует");
      }

      
      const user = new User(username, email, password);
      await db.createUserEntity(user);

      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Регистрация успешна" }));
    } catch (e) {
      console.error(e);
      res.writeHead(500);
      res.end("Ошибка сервера");
    }
  },

  async login(req, res) {
    try {
      const { username, password } = req.body;
      console.log("log authControllr.js строка 40 password username",password, username)
      if (!username || !password) {
        res.writeHead(400);
        return res.end("Введите логин и пароль");
      }

      const user = await db.findUserByUsername(username);
        console.log("=============login()============");
        console.log("password: ",user.getPassword());
        console.log("username: ",user.getUsername());
        console.log("email: ",user.getEmail());
        
        console.log("=============login()============");
      
      if (!user) {
        res.writeHead(401);
        return res.end("Неверный логин или пароль");
      }
      console.log("user.getPassword()",user.getPassword());

      const isValid = await bcrypt.compare(password, user.getPassword());
      if (!isValid) {
        res.writeHead(401);
        return res.end("Неверный логин или пароль");
      }

      res.writeHead(200, {
        "Content-Type": "application/json",
        "X-User": user.getUsername(), // простая псевдо-авторизация
      });

      res.end(
        JSON.stringify({
          message: "Вход выполнен",
          user: user.toJSON(),
        })
      );
    } catch (e) {
      console.error(e);
      res.writeHead(500);
      res.end("Ошибка сервера");
    }
  },
};
