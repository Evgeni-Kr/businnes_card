const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const User = require('./entities/User.js');
const Order = require('./entities/Order.js');


class Database {
    constructor() {
        this.pool = mysql.createPool({
            host: 'localhost',
            user: 'user',
            password: 'user',
            database: 'business_card',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }

    async createUser(username, email, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        try {
            const [result] = await this.pool.query(
                "INSERT INTO my_user (username, email, password, role) VALUES (?, ?, ?, ?)",
                [username, email, hashedPassword, 'ROLE_USER']
            );
            
            // Возвращаем entity объект
            return new User(
                result.insertId,
                username,
                email,
                hashedPassword,
                'ROLE_USER'
            );
        } catch (error) {
            console.error('Ошибка создания пользователя:', error);
            throw error;
        }
    }

    async createUserEntity(userEntity) {
        // Проверяем валидность
        const validationErrors = userEntity.validate();
        if (validationErrors.length > 0) {
            throw new Error(`Ошибки валидации: ${validationErrors.join(', ')}`);
        }

        // Хешируем пароль
        const hashedPassword = await bcrypt.hash(userEntity.getPassword(), 10);
        
        try {
            const [result] = await this.pool.query(
                "INSERT INTO my_user (username, email, password, role) VALUES (?, ?, ?, ?)",
                [
                    userEntity.getUsername(),
                    userEntity.getEmail(),
                    hashedPassword,
                    userEntity.getRole()
                ]
            );
            
            // Обновляем ID в entity
            userEntity.setId(result.insertId);
            userEntity.setPassword(hashedPassword); // Сохраняем хешированный пароль
            
            return userEntity;
        } catch (error) {
            console.error('Ошибка создания пользователя:', error);
            throw error;
        }
    }

    async findUserByUsername(username) {
        try {
            const [rows] = await this.pool.query(
                "SELECT * FROM my_user WHERE username = ?",
                [username]
            );
            
            // Возвращаем entity объект
            return User.fromDatabase(rows[0]);
        } catch (error) {
            console.error('Ошибка поиска пользователя по username:', error);
            throw error;
        }
    }

    async findUserByEmail(email) {
        try {
            const [rows] = await this.pool.query(
                "SELECT * FROM my_user WHERE email = ?",
                [email]
            );
            
            // Возвращаем entity объект
            return User.fromDatabase(rows[0]);
        } catch (error) {
            console.error('Ошибка поиска пользователя по email:', error);
            throw error;
        }
    }

    async findUserById(id) {
        try {
            const [rows] = await this.pool.query(
                'SELECT * FROM my_user WHERE id = ?',
                [id]
            );
            
            // Возвращаем entity объект
            return User.fromDatabase(rows[0]);
        } catch (error) {
            console.error('Ошибка поиска пользователя по ID:', error);
            throw error;
        }
    }

    async validateUser(username, password) {
        try {
            const user = await this.findUserByUsername(username);
            if (!user) return null;

            const isValid = await bcrypt.compare(password, user.getPassword());
            return isValid ? user : null;
        } catch (error) {
            console.error('Ошибка валидации пользователя:', error);
            return null;
        }
    }

    async updateUser(userEntity) {
        try {
            const [result] = await this.pool.query(
                "UPDATE my_user SET username = ?, email = ?, role = ? WHERE id = ?",
                [
                    userEntity.getUsername(),
                    userEntity.getEmail(),
                    userEntity.getRole(),
                    userEntity.getId()
                ]
            );
            
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Ошибка обновления пользователя:', error);
            throw error;
        }
    }

    async deleteUser(id) {
        try {
            const [result] = await this.pool.query(
                "DELETE FROM my_user WHERE id = ?",
                [id]
            );
            
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Ошибка удаления пользователя:', error);
            throw error;
        }
    }

    async getAllUsers(limit = 100, offset = 0) {
        try {
            const [rows] = await this.pool.query(
                "SELECT * FROM my_user ORDER BY id LIMIT ? OFFSET ?",
                [limit, offset]
            );
            
            // Преобразуем все строки в entity объекты
            return rows.map(row => User.fromDatabase(row));
        } catch (error) {
            console.error('Ошибка получения пользователей:', error);
            throw error;
        }
    }

    async close() {
        await this.pool.end();
    }
}

module.exports = new Database();