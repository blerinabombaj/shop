const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Welcome to the Shop!');
});

app.listen(port, () => {
  console.log(`Shop app listening on port ${port}`);
});
