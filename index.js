// Arquivo principal apenas para testes e demonstração

const Sistema = require('./sistema')
const Condutor = require('./Condutor')
const AgenteTransito = require('./AgenteTransito')
const Veiculo = require('./Veiculo')

const sistema = new Sistema()

// Criando usuários
const condutor = new Condutor(
    null,
    'João',
    '11122233344',
    'joao@example.com',
    '1234',
    '1990-01-01'
)

const agente = new AgenteTransito(
    null,
    'Maria',
    '99988877766',
    'maria@transito.com',
    'abcd',
    'M-001'
)

// Cadastrando usuários no sistema
const idCondutor = sistema.addUsuario(condutor)
const idAgente = sistema.addUsuario(agente)

// Criando e associando veículo
const veic = new Veiculo('ABC-1234', 'Civic', 'Honda', 'Prata')
sistema.addVeiculo(veic, idCondutor)

// Agente registra uma multa
const multa = sistema.registrarMulta(
    agente,
    'ABC-1234',
    'Excesso de velocidade',
    250
)

console.log('Multa registrada:', multa)

// Condutor consulta suas multas
const multasDoCondutor = sistema.listarMultasPorUsuario(idCondutor)
console.log('Multas do condutor:', multasDoCondutor)

// Teste de autenticação
const autenticado = sistema.autenticar(idCondutor, '1234')
console.log('Autenticado:', !!autenticado)
