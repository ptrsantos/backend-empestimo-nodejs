class Simulation {
  constructor(valorDesejado, prazo) {
    this.valorDesejado = valorDesejado;
    this.prazo = prazo;
  }
}

class SimulationResult {
  constructor(idSimulacao, produto, resultadoSimulacao) {
    this.idSimulacao = idSimulacao;
    this.produto = {
      id: produto.id,
      nome: produto.nome,
      taxa: produto.taxa
    };
    this.resultadoSimulacao = resultadoSimulacao;
  }
}

class Parcela {
  constructor(numero, valorAmortizacao, valorJuros, valorPrestacao) {
    this.numero = numero;
    this.valorAmortizacao = valorAmortizacao;
    this.valorJuros = valorJuros;
    this.valorPrestacao = valorPrestacao;
  }
}

module.exports = { Simulation, SimulationResult, Parcela };