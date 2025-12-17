class Order {
    constructor({
        _id = null,
        userId,
        service,
        message,
        status = 'NEW',
        adminResponse = null,
        createdAt = new Date(),
        answeredAt = null
    }) {
        this._id = _id;
        this.userId = userId;
        this.service = service;
        this.message = message;
        this.status = status;
        this.adminResponse = adminResponse;
        this.createdAt = createdAt;
        this.answeredAt = answeredAt;
    }

    validate() {
        const errors = [];
        if (!this.userId) errors.push('Не указан пользователь');
        if (!this.service) errors.push('Не указана услуга');
        if (!this.message || this.message.length < 10)
            errors.push('Сообщение слишком короткое');
        return errors;
    }
}

module.exports = Order;
