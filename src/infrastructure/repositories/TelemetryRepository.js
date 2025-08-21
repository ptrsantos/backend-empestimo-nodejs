const SQLiteDatabase = require('../database/SQLiteDatabase');

class TelemetryRepository {
  constructor() {
    this.db = SQLiteDatabase.getConnection();
  }

  async save(nomeApi, tempoResposta, sucesso) {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(`
        INSERT INTO telemetria (nomeApi, tempoResposta, sucesso)
        VALUES (?, ?, ?)
      `);
      
      stmt.run([nomeApi, tempoResposta, sucesso ? 1 : 0], function(err) {
        if (err) reject(err);
        else resolve();
      });
      
      stmt.finalize();
    });
  }

  async getTelemetryByDate(dataReferencia) {
    return new Promise((resolve, reject) => {
      this.db.all(`
        SELECT 
          nomeApi,
          COUNT(*) as qtdRequisicoes,
          AVG(tempoResposta) as tempoMedio,
          MIN(tempoResposta) as tempoMinimo,
          MAX(tempoResposta) as tempoMaximo,
          AVG(CAST(sucesso AS FLOAT)) as percentualSucesso
        FROM telemetria 
        WHERE DATE(dataRequisicao) = ?
        GROUP BY nomeApi
      `, [dataReferencia], (err, rows) => {
        if (err) return reject(err);
        
        resolve({
          dataReferencia,
          listaEndpoints: rows.map(row => ({
            nomeApi: row.nomeApi,
            qtdRequisicoes: row.qtdRequisicoes,
            tempoMedio: Math.round(row.tempoMedio),
            tempoMinimo: row.tempoMinimo,
            tempoMaximo: row.tempoMaximo,
            percentualSucesso: row.percentualSucesso
          }))
        });
      });
    });
  }
}

module.exports = TelemetryRepository;