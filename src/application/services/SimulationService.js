const { Simulation, SimulationResult } = require('../../domain/entities/Simulation');
const LoanCalculatorService = require('../../domain/services/LoanCalculatorService');
const SimulationRepository = require('../../infrastructure/repositories/SimulationRepository');

class SimulationService {
  constructor(productRepository) {
    this.productRepository = productRepository;
    this.loanCalculator = new LoanCalculatorService();
    this.simulationRepository = new SimulationRepository();
  }

  async calculateLoan(simulationData) {
    const { valorDesejado, prazo } = simulationData;
    
    const product = await this.productRepository.findValidProduct(valorDesejado, prazo);
    
    if (!product) {
      throw new Error('Nenhum produto disponível para os parâmetros informados');
    }

    const simulation = new Simulation(valorDesejado, prazo);
    const result = this.loanCalculator.calculate(simulation, product);
    
    // Persistir simulação
    await this.simulationRepository.save(simulation, result);
    
    return result;
  }

  async getAllSimulations(pagina, qtdRegistrosPagina) {
    return await this.simulationRepository.findAll(pagina, qtdRegistrosPagina);
  }

  async getVolumeByProductAndDate(dataReferencia) {
    return await this.simulationRepository.getVolumeByProductAndDate(dataReferencia);
  }

  async calculatePriceSimulation(simulationRequest) {
    const { produtoId, valorEmprestimo, numeroMeses } = simulationRequest;
    
    // Buscar produto pelo ID
    const produto = await this.productRepository.findById(produtoId);
    
    if (!produto) {
      throw new Error('Produto não encontrado');
    }

    // Criar entidade Simulation para persistência
    const simulation = new Simulation(valorEmprestimo, numeroMeses);
    
    // Calcular usando a fórmula Price
    const tabelaPrice = this.calcularTabelaPrice(valorEmprestimo, produto.taxa, numeroMeses);
    
    // Calcular valores totais
    const parcelaMensal = tabelaPrice[0].parcela;
    const valorTotalComJuros = parcelaMensal * numeroMeses;
    
    // Preparar memória de cálculo
    const memoriaCalculo = tabelaPrice.map(item => ({
      mes: item.periodo,
      juros: Math.round(item.juros * 100) / 100,
      amortizacao: Math.round(item.amortizacao * 100) / 100,
      saldo: Math.round(item.saldoDevedor * 100) / 100
    }));

    // Criar resultado da simulação para persistência
    const simulationResult = new SimulationResult(
      this.loanCalculator.generateSimulationId(),
      produto,
      {
        tipo: 'PRICE',
        valorSolicitado: valorEmprestimo,
        prazo: numeroMeses,
        taxaEfetivaMensal: produto.taxa,
        parcelaMensal: Math.round(parcelaMensal * 100) / 100,
        valorTotalComJuros: Math.round(valorTotalComJuros * 100) / 100,
        memoriaCalculo: memoriaCalculo
      }
    );

    // Persistir simulação no banco
    await this.simulationRepository.save(simulation, simulationResult);

    // Retornar resposta no formato solicitado
    return {
      produto: produto.nome,
      valorSolicitado: valorEmprestimo,
      prazo: numeroMeses,
      taxaEfetivaMensal: produto.taxa,
      parcelaMensal: Math.round(parcelaMensal * 100) / 100,
      valorTotalComJuros: Math.round(valorTotalComJuros * 100) / 100,
      memoriaCalculo: memoriaCalculo
    };
  }

  calcularTabelaPrice(valorPresente, taxa, periodos) {
    const i = taxa; // Taxa já está em decimal no banco
    const parcela = (valorPresente * i) / (1 - Math.pow(1 + i, -periodos));
    const tabela = [];
    let saldoDevedor = valorPresente;

    for (let periodo = 1; periodo <= periodos; periodo++) {
      const juros = saldoDevedor * i;
      const amortizacao = parcela - juros;
      saldoDevedor -= amortizacao;

      tabela.push({
        periodo: periodo,
        parcela: parcela,
        juros: juros,
        amortizacao: amortizacao,
        saldoDevedor: saldoDevedor,
      });
    }

    return tabela;
  }
}

module.exports = SimulationService;