const express = require('express');
const TelemetryController = require('../controllers/TelemetryController');
const TelemetryService = require('../../application/services/TelemetryService');

const router = express.Router();

const telemetryService = new TelemetryService();
const telemetryController = new TelemetryController(telemetryService);

router.get('/:dataReferencia', (req, res) => telemetryController.getTelemetryByDate(req, res));

module.exports = router;