# API Simulador de Empréstimos CAIXA

API Node.js desenvolvida com arquitetura **Clean Architecture (DDD + MVC)** para simulação de empréstimos usando a **Tabela Price**.

## 🚀 Funcionalidades

✅ **Simulação de empréstimos** com Tabela Price  
✅ **Gestão de produtos** financeiros  
✅ **Persistência** em SQLite  
✅ **Telemetria** de performance  
✅ **Relatórios** por data e produto  
✅ **Docker** containerizado  

## 📋 Endpoints Principais

### Simulações
- `POST /simulacoes` - Criar nova simulação
  ```json
  {
    "produtoId": 1,
    "valorEmprestimo": 10000,
    "numeroMeses": 12
  }
  ```
- `GET /simulacoes` - Listar simulações (paginado)
- `GET /simulacoes/volume/:dataReferencia` - Volume por produto/data

### Produtos
- `GET /produtos` - Listar produtos disponíveis

### Telemetria
- `GET /telemetria/:dataReferencia` - Dados de performance

## 🏗️ Estrutura do Projeto

```
backend-nodejs/
├── src/
│   ├── app.js                          # Configuração Express
│   ├── application/
│   │   └── services/                   # Serviços de aplicação
│   │       ├── ProductService.js
│   │       ├── SimulationService.js
│   │       └── TelemetryService.js
│   ├── domain/
│   │   ├── entities/                   # Entidades de domínio
│   │   │   ├── Product.js
│   │   │   └── Simulation.js
│   │   ├── repositories/               # Interfaces de repositório
│   │   │   └── IProductRepository.js
│   │   └── services/                   # Serviços de domínio
│   │       └── LoanCalculatorService.js
│   ├── infrastructure/
│   │   ├── database/
│   │   │   └── SQLiteDatabase.js       # Única implementação de BD
│   │   └── repositories/               # Implementações dos repositórios
│   │       ├── ProductRepository.js
│   │       ├── SimulationRepository.js
│   │       └── TelemetryRepository.js
│   ├── presentation/
│   │   ├── controllers/                # Controllers da API
│   │   │   ├── ProductController.js
│   │   │   ├── SimulationController.js
│   │   │   └── TelemetryController.js
│   │   └── routes/                     # Rotas da API
│   │       ├── productRoutes.js
│   │       ├── simulationRoutes.js
│   │       └── telemetryRoutes.js
│   └── utils/
│       └── port-checker.js
├── scripts/
│   └── clear-port.js                   # Script de limpeza de porta
├── caixa_emprestimos.db               # Banco SQLite
├── docker-compose.yml
├── Dockerfile
├── package.json
├── server.js                          # Entrada da aplicação
├── start-api.bat                      # Script de inicialização Windows
└── stop-api.bat                       # Script de parada Windows
```

## 🔧 Execução

### Pré-requisitos
- Node.js 14+
- npm

### Local
```bash
# Instalar dependências
npm install

# Iniciar servidor
npm start
```

A API estará disponível em: `http://localhost:3000`

### Docker
```bash
# Construir e executar
docker-compose up --build

# Ou usando Docker diretamente
docker build -t caixa-api .
docker run -p 3000:3000 caixa-api
```

## 💾 Banco de Dados

**SQLite** (caixa_emprestimos.db):
- **produtos**: Produtos financeiros disponíveis
- **simulacoes**: Histórico de simulações realizadas
- **telemetria**: Dados de performance da API

### Produtos Pré-configurados
| ID | Nome | Taxa Mensal | Prazo Máximo |
|----|------|-------------|--------------|
| 1  | Produto 1 | 1.79% | 24 meses |
| 2  | Produto 2 | 1.75% | 48 meses |
| 3  | Produto 3 | 1.82% | 96 meses |
| 4  | Produto 4 | 1.51% | 120 meses |

## 📊 Resposta da Simulação

```json
{
  "produto": "Produto 1",
  "valorSolicitado": 10000,
  "prazo": 12,
  "taxaEfetivaMensal": 0.0179,
  "parcelaMensal": 896.45,
  "valorTotalComJuros": 10757.40,
  "memoriaCalculo": [
    {
      "mes": 1,
      "juros": 179.00,
      "amortizacao": 717.45,
      "saldo": 9282.55
    }
    // ... demais parcelas
  ]
}
```

## 🏛️ Arquitetura

O projeto segue os princípios da **Clean Architecture**:

- **Domain**: Entidades e regras de negócio puras
- **Application**: Casos de uso e orquestração
- **Infrastructure**: Acesso a dados e recursos externos
- **Presentation**: Controllers e rotas da API

## 🧮 Cálculo Price

A API implementa a **Tabela Price** (Sistema Francês) onde:
- Parcelas fixas durante todo o período
- Amortização crescente
- Juros decrescentes
- Fórmula: `PMT = PV × [(1+i)^n × i] / [(1+i)^n - 1]`

## 🚀 Scripts Disponíveis

- `npm start` - Inicia o servidor
- `npm run dev` - Modo desenvolvimento com nodemon
- `start-api.bat` - Script Windows para iniciar
- `stop-api.bat` - Script Windows para parar

## 📈 Telemetria

A API coleta automaticamente:
- Tempo de resposta dos endpoints
- Taxa de sucesso/erro
- Volume de simulações por período
- Performance por produto