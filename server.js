const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');
const { Client } = pg;

const app = express();
const port = process.env.PORT || 3000;

// Middleware для парсинга JSON
app.use(bodyParser.json());

// Настройка PostgreSQL клиента
const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '2015',
    database: 'gbg'
});

client.connect();

// Маршрут для обработки POST-запросов
app.post('/api/data', async (req, res) => {
    const { data1, data2 } = req.body;

    try {
        const query = 'INSERT INTO ваша_таблица (колонка1, колонка2) VALUES ($1, $2) RETURNING *';
        const values = [data1, data2];
        const result = await client.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка при вставке данных:', error.stack);
        res.status(500).send('Ошибка сервера');
    }
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});
