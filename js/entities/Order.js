class Order {
    constructor(
        id = null,
        userId,
        service,
        message,
        status = 'NEW',
        adminResponse = null,
        createdAt = null,
        answeredAt = null
    ) {
        this.id = id;
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

    static fromDatabase(row) {
        if (!row) return null;

        return new Order(
            row.id,
            row.user_id,
            row.service,
            row.message,
            row.status,
            row.admin_response,
            row.created_at,
            row.answered_at
        );
    }
}

module.exports = Order;
