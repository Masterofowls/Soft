const express = require('express');
const app = express();
const pool = require('./db'); // Make sure the path is correct based on where you saved db.js

app.get('/', (req, res) => {
  pool.query('SELECT NOW()', (err, result) => {
    if (err) {
      return res.status(500).send(err.stack);
    }
    res.send(`Current Time: ${result.rows[0].now}`);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
