const Product = require('../../domain/entities/Product');

class ProductService {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async getAllProducts() {
    return await this.productRepository.findAll();
  }

  async createProduct(productData) {
    const product = new Product(null, productData.nome, productData.taxa, productData.prazo);
    return await this.productRepository.create(product);
  }

  async getProductById(id) {
    return await this.productRepository.findById(id);
  }

  async updateProduct(id, productData) {
    const product = new Product(id, productData.nome, productData.taxa, productData.prazo);
    return await this.productRepository.update(id, product);
  }

  async deleteProduct(id) {
    return await this.productRepository.delete(id);
  }
}

module.exports = ProductService;