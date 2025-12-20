// entities/User.js
class User {
    constructor( username, email, password, role = 'ROLE_USER',id = null) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    getId() {
        return this.id;
    }

    setId(id) {
        this.id = id;
    }

    getUsername() {
        return this.username;
    }

    setUsername(username) {
        this.username = username;
    }

    getEmail() {
        return this.email;
    }

    setEmail(email) {
        this.email = email;
    }

    getPassword() {
        console.log("user.getPassword", this.password);
        return this.password;
    }

    setPassword(password) {
        console.log("user.setPassword", password)
        this.password = password;
    }

    getRole() {
        return this.role;
    }

    setRole(role) {
        this.role = role;
    }

    // Преобразование в объект (для JSON)
    toObject() {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            role: this.role
            // Пароль не включаем в объект для безопасности
        };
    }

    toJSON() {
        return this.toObject();
    }

    static fromDatabase(row) {
        if (!row) return null;
        console.log("=============fromDatabase============");
        console.log("row.password",row.password);
        console.log("row.id",row.id);
        console.log("row.email",row.email);
        console.log("row.role",row.role);
        console.log("=============fromDatabase============");
        return new User(
    row.username,   // username
    row.email,      // email
    row.password,   // password (HASH!)
    row.role,       // role
    row.id          // id
  );
    }

    static fromRequest(data) {
        console.log("data.passwors user.js 79:", data.password );
        return new User(
            data.username,
            data.email,
            data.password,
            data.role || 'ROLE_USER',
            null
        );
    }

    validate() {
        const errors = [];

        if (!this.username || this.username.trim().length < 3) {
            errors.push('Имя пользователя должно содержать минимум 3 символа');
        }

        if (!this.email || !this.validateEmail(this.email)) {
            errors.push('Некорректный email адрес');
        }

        if (!this.password || this.password.length < 6) {
            errors.push('Пароль должен содержать минимум 6 символов');
        }

        if (!this.role || !['ROLE_USER', 'ROLE_ADMIN'].includes(this.role)) {
            errors.push('Некорректная роль пользователя');
        }

        return errors;
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    clone() {
        return new User(
            this.id,
            this.username,
            this.email,
            this.password,
            this.role
        );
    }

    equals(otherUser) {
        if (!otherUser || !(otherUser instanceof User)) return false;
        
        return this.id === otherUser.id &&
               this.username === otherUser.username &&
               this.email === otherUser.email &&
               this.role === otherUser.role;
    }
}

module.exports = User;