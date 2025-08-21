const fs = require('fs');
const path = require('path');

class JsonDatabase {
  constructor() {
    this.dbPath = path.join(__dirname, '../../../data.json');
    this.initialize();
  }

  initialize() {
    // Criar estrutura inicial do banco se não existir
    if (!fs.existsSync(this.dbPath)) {
      const initialData = {
        produtos: [
          { id: 1, nome: 'Produto 1', taxa: 0.0179, prazo: 24 },
          { id: 2, nome: 'Produto 2', taxa: 0.0175, prazo: 48 },
          { id: 3, nome: 'Produto 3', taxa: 0.0182, prazo: 96 },
          { id: 4, nome: 'Produto 4', taxa: 0.0151, prazo: 120 }
        ],
        simulacoes: [],
        telemetry: []
      };
      this.saveData(initialData);
    }
  }

  getData() {
    try {
      const data = fs.readFileSync(this.dbPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Erro ao ler dados:', error);
      return { produtos: [], simulacoes: [], telemetry: [] };
    }
  }

  saveData(data) {
    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
    }
  }

  // Simular operações SQL
  query(sql, params = []) {
    return new Promise((resolve, reject) => {
      try {
        const data = this.getData();
        
        if (sql.includes('SELECT * FROM produtos')) {
          resolve(data.produtos);
        } else if (sql.includes('SELECT * FROM simulacoes')) {
          resolve(data.simulacoes);
        } else if (sql.includes('INSERT INTO simulacoes')) {
          const newId = data.simulacoes.length + 1;
          const simulacao = {
            id: newId,
            idSimulacao: params[0],
            valorDesejado: params[1],
            prazo: params[2],
            produtoId: params[3],
            resultadoSimulacao: params[4],
            dataSimulacao: new Date().toISOString()
          };
          data.simulacoes.push(simulacao);
          this.saveData(data);
          resolve({ insertId: newId });
        } else if (sql.includes('INSERT INTO telemetry')) {
          const newId = data.telemetry.length + 1;
          const telemetry = {
            id: newId,
            endpoint: params[0],
            method: params[1],
            statusCode: params[2],
            responseTime: params[3],
            timestamp: new Date().toISOString()
          };
          data.telemetry.push(telemetry);
          this.saveData(data);
          resolve({ insertId: newId });
        } else {
          resolve([]);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  run(sql, params = []) {
    return this.query(sql, params);
  }

  all(sql, params = []) {
    return this.query(sql, params);
  }

  get(sql, params = []) {
    return this.query(sql, params).then(results => results[0] || null);
  }

  getConnection() {
    return this;
  }
}

module.exports = new JsonDatabase();