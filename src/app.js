const express = require('express');
const cors = require('cors');
const productRoutes = require('./presentation/routes/productRoutes');
const simulationRoutes = require('./presentation/routes/simulationRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/produtos', productRoutes);
app.use('/simulacoes', simulationRoutes);

module.exports = app;