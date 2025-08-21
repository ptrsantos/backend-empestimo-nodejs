const { SimulationResult, Parcela } = require('../entities/Simulation');

class LoanCalculatorService {
  calculate(simulation, product) {
    const idSimulacao = this.generateSimulationId();
    const taxaMensal = product.taxaJuros;
    
    const sacParcelas = this.calculateSAC(simulation.valorDesejado, simulation.prazo, taxaMensal);
    const priceParcelas = this.calculatePRICE(simulation.valorDesejado, simulation.prazo, taxaMensal);
    
    const resultadoSimulacao = [
      { tipo: 'SAC', parcelas: sacParcelas },
      { tipo: 'PRICE', parcelas: priceParcelas }
    ];

    return new SimulationResult(
      idSimulacao,
      product.codigoProduto,
      product.nomeProduto,
      product.taxaJuros,
      resultadoSimulacao
    );
  }

  calculateSAC(valorPrincipal, prazo, taxaMensal) {
    const parcelas = [];
    const amortizacao = valorPrincipal / prazo;
    let saldoDevedor = valorPrincipal;

    for (let i = 1; i <= prazo; i++) {
      const valorJuros = saldoDevedor * taxaMensal;
      const valorPrestacao = amortizacao + valorJuros;
      
      parcelas.push(new Parcela(
        i,
        Math.round(amortizacao * 100) / 100,
        Math.round(valorJuros * 100) / 100,
        Math.round(valorPrestacao * 100) / 100
      ));
      
      saldoDevedor -= amortizacao;
    }
    
    return parcelas;
  }

  calculatePRICE(valorPrincipal, prazo, taxaMensal) {
    const parcelas = [];
    const prestacao = valorPrincipal * (taxaMensal * Math.pow(1 + taxaMensal, prazo)) / (Math.pow(1 + taxaMensal, prazo) - 1);
    let saldoDevedor = valorPrincipal;

    for (let i = 1; i <= prazo; i++) {
      const valorJuros = saldoDevedor * taxaMensal;
      const valorAmortizacao = prestacao - valorJuros;
      
      parcelas.push(new Parcela(
        i,
        Math.round(valorAmortizacao * 100) / 100,
        Math.round(valorJuros * 100) / 100,
        Math.round(prestacao * 100) / 100
      ));
      
      saldoDevedor -= valorAmortizacao;
    }
    
    return parcelas;
  }

  generateSimulationId() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    return parseInt(`${year}${month}${day}${random}`);
  }
}

module.exports = LoanCalculatorService;