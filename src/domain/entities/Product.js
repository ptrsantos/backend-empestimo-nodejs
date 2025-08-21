class Product {
  constructor(id, nome, taxa, prazo) {
    this.id = id;
    this.nome = nome;
    this.taxa = taxa;
    this.prazo = prazo;
  }

  toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      taxa: this.taxa,
      prazo: this.prazo
    };
  }
}

module.exports = Product;