const express = require('express');
const http = require('http');
const cors = require('cors');
const socketSetup = require('./socket');
const db = require('./db');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketSetup(server);

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/users', require('./routes/users'));

// Servidor escuchando
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
