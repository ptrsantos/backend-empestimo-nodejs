const fs = require('fs');
const path = require('path');

class SQLiteDatabase {
  constructor() {
    this.dbPath = path.join(__dirname, '../../../caixa_emprestimos.json');
    this.initialize();
  }

  initialize() {
    // Criar estrutura inicial se não existir
    if (!fs.existsSync(this.dbPath)) {
      const initialData = {
        produtos: [
          { id: 1, nome: 'Produto 1', taxa: 0.0179, prazo: 24 },
          { id: 2, nome: 'Produto 2', taxa: 0.0175, prazo: 48 },
          { id: 3, nome: 'Produto 3', taxa: 0.0182, prazo: 96 },
          { id: 4, nome: 'Produto 4', taxa: 0.0151, prazo: 120 }
        ],
        simulacoes: [],
        telemetria: [],
        sequences: {
          produtos: 4,
          simulacoes: 0,
          telemetria: 0
        }
      };
      this.saveData(initialData);
    }

    console.log('SQLiteDatabase (JSON) inicializado com sucesso');
  }

  getData() {
    try {
      const data = fs.readFileSync(this.dbPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Erro ao ler dados:', error);
      return { produtos: [], simulacoes: [], telemetria: [], sequences: { produtos: 0, simulacoes: 0, telemetria: 0 } };
    }
  }

  saveData(data) {
    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
    }
  }

  parseSQL(sql, params = []) {
    const data = this.getData();
    sql = sql.toLowerCase().trim();
    
    // Substituir parâmetros ? pelos valores
    let processedSql = sql;
    params.forEach((param) => {
      processedSql = processedSql.replace('?', `'${param}'`);
    });

    // SELECT queries
    if (processedSql.includes('select * from produtos')) {
      return data.produtos;
    }
    
    if (processedSql.includes('select * from produtos where id =')) {
      const idMatch = processedSql.match(/id = '(\d+)'/);
      const id = idMatch ? parseInt(idMatch[1]) : null;
      return data.produtos.filter(p => p.id === id);
    }

    if (processedSql.includes('insert into produtos')) {
      const newId = ++data.sequences.produtos;
      const produto = {
        id: newId,
        nome: params[0],
        taxa: parseFloat(params[1]),
        prazo: parseInt(params[2])
      };
      data.produtos.push(produto);
      this.saveData(data);
      return { lastID: newId, changes: 1 };
    }

    if (processedSql.includes('update produtos set')) {
      const idMatch = processedSql.match(/where id = '(\d+)'/);
      const id = idMatch ? parseInt(idMatch[1]) : null;
      if (!id) return { changes: 0 };

      const productIndex = data.produtos.findIndex(p => p.id === id);
      if (productIndex === -1) return { changes: 0 };

      data.produtos[productIndex].nome = params[0];
      data.produtos[productIndex].taxa = parseFloat(params[1]);
      data.produtos[productIndex].prazo = parseInt(params[2]);
      this.saveData(data);
      return { changes: 1 };
    }

    if (processedSql.includes('delete from produtos where id =')) {
      const idMatch = processedSql.match(/id = '(\d+)'/);
      const id = idMatch ? parseInt(idMatch[1]) : null;
      if (!id) return { changes: 0 };

      const initialLength = data.produtos.length;
      data.produtos = data.produtos.filter(p => p.id !== id);
      
      if (initialLength > data.produtos.length) {
        this.saveData(data);
        return { changes: 1 };
      }
      return { changes: 0 };
    }

    if (processedSql.includes('select * from simulacoes')) {
      return data.simulacoes;
    }

    // INSERT queries
    if (processedSql.includes('insert into simulacoes')) {
      const newId = ++data.sequences.simulacoes;
      const simulacao = {
        id: newId,
        idSimulacao: params[0],
        valorDesejado: parseFloat(params[1]),
        prazo: parseInt(params[2]),
        produtoId: parseInt(params[3]),
        resultadoSimulacao: params[4],
        dataSimulacao: new Date().toISOString()
      };
      data.simulacoes.push(simulacao);
      this.saveData(data);
      return { lastID: newId, changes: 1 };
    }

    if (processedSql.includes('insert into telemetria')) {
      const newId = ++data.sequences.telemetria;
      const telemetria = {
        id: newId,
        nomeApi: params[0],
        tempoResposta: parseInt(params[1]),
        sucesso: parseInt(params[2]),
        dataRequisicao: new Date().toISOString()
      };
      data.telemetria.push(telemetria);
      this.saveData(data);
      return { lastID: newId, changes: 1 };
    }

    return [];
  }

  // Adaptar métodos para compatibilidade com sqlite3
  all(sql, params = []) {
    try {
      const result = this.parseSQL(sql, params);
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error('Erro em all():', error);
      return [];
    }
  }

  get(sql, params = []) {
    try {
      const results = this.all(sql, params);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      console.error('Erro em get():', error);
      return null;
    }
  }

  run(sql, params = []) {
    try {
      const result = this.parseSQL(sql, params);
      return result.lastID ? result : { lastID: 0, changes: 1 };
    } catch (error) {
      console.error('Erro em run():', error);
      throw error;
    }
  }

  prepare(sql) {
    // Simular prepared statement
    return {
      run: (params) => this.run(sql, params),
      all: (params) => this.all(sql, params),
      get: (params) => this.get(sql, params),
      finalize: () => {} // No-op para compatibilidade
    };
  }

  serialize(callback) {
    // Executar callback imediatamente (simular sincronização)
    callback();
  }

  getConnection() {
    return this;
  }
}

module.exports = new SQLiteDatabase();