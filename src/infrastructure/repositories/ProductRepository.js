const Product = require('../../domain/entities/Product');
const SQLiteDatabase = require('../database/SQLiteDatabase');

class ProductRepository {
  constructor() {
    this.db = SQLiteDatabase.getConnection();
  }

  async findAll() {
    try {
      const rows = this.db.all('SELECT * FROM produtos');
      const products = rows.map(row => new Product(
        row.id,
        row.nome,
        row.taxa,
        row.prazo
      ));
      return products;
    } catch (err) {
      console.error('Erro ao consultar produtos:', err);
      throw err;
    }
  }

  async findById(id) {
    try {
      const row = this.db.get('SELECT * FROM produtos WHERE id = ?', [id]);
      if (!row) {
        return null;
      }
      return new Product(
        row.id,
        row.nome,
        row.taxa,
        row.prazo
      );
    } catch (err) {
      console.error('Erro ao consultar produto por ID:', err);
      throw err;
    }
  }

  async create(product) {
    try {
      const stmt = this.db.prepare('INSERT INTO produtos (nome, taxa, prazo) VALUES (?, ?, ?)');
      const result = stmt.run([product.nome, product.taxa, product.prazo]);
      stmt.finalize();
      return new Product(result.lastID, product.nome, product.taxa, product.prazo);
    } catch (err) {
      console.error('Erro ao criar produto:', err);
      throw err;
    }
  }

  async update(id, product) {
    try {
      const stmt = this.db.prepare('UPDATE produtos SET nome = ?, taxa = ?, prazo = ? WHERE id = ?');
      const result = stmt.run([product.nome, product.taxa, product.prazo, id]);
      stmt.finalize();
      if (result.changes === 0) {
        return null;
      }
      return new Product(id, product.nome, product.taxa, product.prazo);
    } catch (err) {
      console.error('Erro ao atualizar produto:', err);
      throw err;
    }
  }

  async delete(id) {
    try {
      const stmt = this.db.prepare('DELETE FROM produtos WHERE id = ?');
      const result = stmt.run([id]);
      stmt.finalize();
      return result.changes > 0;
    } catch (err) {
      console.error('Erro ao deletar produto:', err);
      throw err;
    }
  }
}

module.exports = ProductRepository;