class SimulationController {
  constructor(simulationService) {
    this.simulationService = simulationService;
  }

  async calculate(req, res) {
    try {
      const result = await this.simulationService.calculateLoan(req.body);
      res.json(result);
    } catch (error) {
      if (error.message.includes('Nenhum produto disponível')) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  async getAll(req, res) {
    try {
      const { pagina = 1, qtdRegistrosPagina = 200 } = req.query;
      const result = await this.simulationService.getAllSimulations(parseInt(pagina), parseInt(qtdRegistrosPagina));
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getVolumeByDate(req, res) {
    try {
      const { dataReferencia } = req.params;
      const result = await this.simulationService.getVolumeByProductAndDate(dataReferencia);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async calculatePrice(req, res) {
    try {
      const result = await this.simulationService.calculatePriceSimulation(req.body);
      res.json(result);
    } catch (error) {
      if (error.message.includes('Produto não encontrado')) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }
}

module.exports = SimulationController;