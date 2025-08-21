const express = require('express');
const SimulationController = require('../controllers/SimulationController');
const SimulationService = require('../../application/services/SimulationService');
const ProductRepository = require('../../infrastructure/repositories/ProductRepository');

const router = express.Router();

const productRepository = new ProductRepository();
const simulationService = new SimulationService(productRepository);
const simulationController = new SimulationController(simulationService);

router.post('/', (req, res) => simulationController.calculatePrice(req, res));
router.get('/', (req, res) => simulationController.getAll(req, res));
router.get('/volume/:dataReferencia', (req, res) => simulationController.getVolumeByDate(req, res));

module.exports = router;