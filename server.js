const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const app = express();
require('dotenv').config(); // Load environment variables from .env file

// Setup Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Setup CORS
app.use(cors());
app.use(express.json());

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint to submit data
app.post('/submit', async (req, res) => {
  const { user_name } = req.body;
  const created_at = new Date().toISOString();

  console.log('Received data:', { user_name, created_at });

  try {
    const { data, error } = await supabase
      .from('gbgtable')
      .insert([{ user_name, created_at }]);

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

// Endpoint to fetch data
app.get('/data', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('gbgtable')
      .select('*');

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data: ' + error.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
