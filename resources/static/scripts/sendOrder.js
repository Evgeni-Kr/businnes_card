
document.querySelector('.contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
        service: document.getElementById('service').value,
        message: document.getElementById('message').value
    };

    const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-user': 'testuser' // временно
        },
        body: JSON.stringify(data)
    });

    if (res.ok) {
        alert('Заявка отправлена!');
        e.target.reset();
    } else {
        alert('Ошибка отправки');
    }
});
