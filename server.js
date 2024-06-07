const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');
const app = express();
require('dotenv').config(); // Загрузка переменных окружения из .env файла

// Вывод переменных окружения для отладки
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY);

// Настройка Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Настройка PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Настройка CORS
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('CORS enabled');
});

app.post('/submit', async (req, res) => {
  const { name, format, type, description } = req.body;

  console.log('Received data:', { name, format, type, description });

  try {
    const { data, error } = await supabase
      .from('gbgtable')
      .insert([{ name, format, type, description }]);

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Data inserted successfully:', data);
    res.status(200).send('Data received and inserted');
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).send('Error inserting data: ' + error.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
