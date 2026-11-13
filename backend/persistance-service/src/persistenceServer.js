require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const env = require('../config/env');
const app = express();

app.use(express.json());
app.use(cookieParser());

const persistenceRoutes = require('./Routes/persistenceRoutes');
app.use('/', persistenceRoutes);
app.use('/api', persistenceRoutes);

const PORT = env.PORT;
app.listen(PORT, () => {
  console.log(`Servizio Persistence attivo sulla porta ${PORT}`);
});