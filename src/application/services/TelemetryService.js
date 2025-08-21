const TelemetryRepository = require('../../infrastructure/repositories/TelemetryRepository');

class TelemetryService {
  constructor() {
    this.telemetryRepository = new TelemetryRepository();
  }

  async recordRequest(nomeApi, tempoResposta, sucesso) {
    await this.telemetryRepository.save(nomeApi, tempoResposta, sucesso);
  }

  async getTelemetryByDate(dataReferencia) {
    return await this.telemetryRepository.getTelemetryByDate(dataReferencia);
  }
}

module.exports = TelemetryService;