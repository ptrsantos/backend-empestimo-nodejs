const SQLiteDatabase = require('../database/SQLiteDatabase');

class SimulationRepository {
  constructor() {
    this.db = SQLiteDatabase.getConnection();
  }

  async save(simulation, simulationResult) {
    try {
      this.db.run(`
        INSERT INTO simulacoes (
          idSimulacao, 
          valorDesejado, 
          prazo, 
          produtoId,
          resultadoSimulacao
        ) VALUES (?, ?, ?, ?, ?)
      `, [
        simulationResult.idSimulacao,
        simulation.valorDesejado,
        simulation.prazo,
        simulationResult.produto.id,
        JSON.stringify(simulationResult.resultadoSimulacao)
      ]);
    } catch (err) {
      console.error('Erro ao salvar simulação:', err);
      throw err;
    }
  }

  async findAll(pagina = 1, qtdRegistrosPagina = 200) {
    const offset = (pagina - 1) * qtdRegistrosPagina;
    
    return new Promise((resolve, reject) => {
      this.db.all(`
        SELECT s.*, p.nome as produtoNome, p.taxa as produtoTaxa
        FROM simulacoes s
        JOIN produtos p ON s.produtoId = p.id
        ORDER BY s.dataSimulacao DESC 
        LIMIT ? OFFSET ?
      `, [qtdRegistrosPagina, offset], (err, rows) => {
        if (err) return reject(err);
        
        resolve({
          pagina,
          registros: rows.map(row => ({
            idSimulacao: row.idSimulacao,
            valorDesejado: row.valorDesejado,
            prazo: row.prazo,
            produto: {
              id: row.produtoId,
              nome: row.produtoNome,
              taxa: row.produtoTaxa
            }
          }))
        });
      });
    });
  }

  async getVolumeByProductAndDate(dataReferencia) {
    return new Promise((resolve, reject) => {
      this.db.all(`
        SELECT 
          p.nome as produto,
          COUNT(*) as quantidadeSimulacoes,
          SUM(s.valorDesejado) as volumeTotal
        FROM simulacoes s
        JOIN produtos p ON s.produtoId = p.id
        WHERE DATE(s.dataSimulacao) = DATE(?)
        GROUP BY s.produtoId, p.nome
        ORDER BY p.nome
      `, [dataReferencia], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }
}

module.exports = SimulationRepository;