const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

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
            return { id: result.insertId, username, email, role: 'ROLE_USER' };
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
            return rows[0];
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
            return rows[0];
        } catch (error) {
            console.error('Ошибка поиска пользователя по email:', error);
            throw error;
        }
    }

    async validateUser(username, password) {
        try {
            const user = await this.findUserByUsername(username);
            if (!user) return null;

            const isValid = await bcrypt.compare(password, user.password);
            return isValid ? user : null;
        } catch (error) {
            console.error('Ошибка валидации пользователя:', error);
            return null;
        }
    }

    async findUserById(id) {
        try {
            const [rows] = await this.pool.query(
                'SELECT * FROM my_user WHERE id = ?',
                [id]
            );
            return rows[0];
        } catch (error) {
            console.error('Ошибка поиска пользователя по ID:', error);
            throw error;
        }
    }

    async close() {
        await this.pool.end();
    }
}

module.exports = new Database();