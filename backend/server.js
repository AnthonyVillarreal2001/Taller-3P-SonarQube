const express = require('express');
const bodyParser = require('body-parser');
const zonesRoutes = require('./routes/zones');
const spacesRoutes = require('./routes/spaces');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

// Routes
app.use('/zones', zonesRoutes);
app.use('/spaces', spacesRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke! ' + err.message);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});