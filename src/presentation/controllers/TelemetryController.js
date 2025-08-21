class TelemetryController {
  constructor(telemetryService) {
    this.telemetryService = telemetryService;
  }

  async getTelemetryByDate(req, res) {
    try {
      const { dataReferencia } = req.params;
      const result = await this.telemetryService.getTelemetryByDate(dataReferencia);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = TelemetryController;