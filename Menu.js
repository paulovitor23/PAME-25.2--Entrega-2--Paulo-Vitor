const readline = require('readline-sync');
const Condutor = require('./Condutor')
const AgenteTransito = require('./AgenteTransito')
const Veiculo = require('./Veiculo');


function menuPrincipal(sistema) {
    let opcao

    do {
        console.log('\n=== MENU PRINCIPAL ===')
        console.log('1 - Login')
        console.log('2 - Cadastro')
        console.log('0 - Sair')

        opcao = readline.questionInt('Escolha uma opcao: ')

        try {
            switch (opcao) {
                case 1:
                    login(sistema)
                    break
                case 2:
                    cadastro(sistema)
                    break
                case 0:
                    console.log('Encerrando sistema...')
                    break
                default:
                    console.log('Opcao invalida')
            }
        } catch (erro) {
            console.log('Erro:', erro.message)
        }

    } while (opcao !== 0)
}

function login(sistema){
    const id = readline.questionInt("ID: ")
    const senha = readline.question("Senha: ")

    const usuario = sistema.autenticar(id,senha)
    
    if(!usuario){
        console.log('Login invalido')
        return
    }
    if (usuario instanceof AgenteTransito) {
        menuAgente(sistema, usuario)
    } 
    else if (usuario instanceof Condutor) {
        menuCondutor(sistema, usuario)
    }
}

function cadastro(sistema) {
    console.log('\n1 - Condutor')
    console.log('2 - Agente de Transito')
    const tipo = readline.questionInt('Tipo: ')

    const nome = readline.question('Nome: ')
    const cpf = readline.question('CPF: ')
    const email = readline.question('Email: ')
    const senha = readline.question('Senha: ')

    let usuario

    if (tipo === 1) {
        const data_nascimento = readline.question('Data de nascimento: ')
        usuario = new Condutor(null, nome, cpf, email, senha,data_nascimento)
    } 
    else if (tipo === 2) {
        const matricula = readline.question('Matricula: ')
        usuario = new AgenteTransito(null, nome, cpf, email, senha, matricula)
    } 
    else {
        console.log('Tipo invalido')
        return
    }
    
    const id = sistema.addUsuario(usuario)
    console.log(`Usuario cadastrado com ID ${id}`)
}

function menuAgente(sistema,agente){ 
    let opcao

    do {
        console.log('\n=== MENU AGENTE ===')
        console.log('1 - Ver meus dados')
        console.log('2 - Listar veiculos')
        console.log('3 - Listar condutores')
        console.log('4 - Aplicar multa')
        console.log('5 - Ver todas as multas')
        console.log('6 - Alterar status da multa')
        console.log('7 - Cancelar multa')
        console.log('0 - Logout')

        opcao = readline.questionInt('Opcao: ')

        try {
            switch (opcao) {
                case 1:
                    console.log(agente)
                    break
                case 2:
                    console.log(sistema.listarTodosVeiculos(agente))
                    break
                case 3:
                    console.log(sistema.listarTodosCondutores(agente))
                    break
                case 4:
                    aplicarMulta(sistema, agente)
                    break
                case 5:
                    console.log(sistema.listarTodasMultas(agente))
                    break
                case 6:
                    alterarStatusMulta(sistema, agente)
                    break
                case 7:
                    cancelarMulta(sistema,agente)
                    break
                case 0:
                    console.log('Logout realizado')
                    break
                default:
                    console.log('Opcao invalida')
            }
        } catch (e) {
            console.log('Erro:', e.message)
        }

    } while (opcao !== 0)
}

function menuCondutor(sistema,condutor){
    let opcao

    do {
        console.log('1 - Ver meus dados')
        console.log('2 - Ver minhas multas')
        console.log('3 - Cadastrar veiculo')
        console.log('4 - Listar meus veiculos')
        console.log('5 - Remover veiculo')
        console.log('6 - Pagar multa')
        console.log('7 - Recorrer multa')
        console.log('8 - Atualizar senha')
        console.log('9 - Atualizar email')
        console.log('0 - Logout')


        opcao = readline.questionInt('Opcao: ')

        try {
            switch (opcao) {
                case 1:
                    console.log(condutor)
                    break
                case 2:
                    console.log(sistema.listarMultasPorUsuario(condutor.id))
                    break
                case 3:
                    cadastrarVeiculo(sistema, condutor)
                    break
                case 4:
                    listarMeusVeiculos(sistema, condutor)
                    break
                case 5:
                    removerVeiculo(sistema, condutor)
                    break
                case 6:
                    pagarMulta(sistema, condutor)
                    break
                case 7:
                    recorrerMulta(sistema, condutor)
                    break
                case 8:
                    atualizarSenha(sistema, condutor)
                    break
                case 9:
                    atualizarEmail(sistema, condutor)
                    break
                case 0:
                    console.log('Logout realizado')
                    break
                default:
                    console.log('Opcao invalida')
            }

        } catch (e) {
            console.log('Erro:', e.message)
        }

    } while (opcao !== 0)

}

/* ACOES */

function cadastrarVeiculo(sistema, condutor) {
    const placa = readline.question('Placa: ')
    const marca = readline.question('Marca: ')
    const modelo = readline.question('Modelo: ')
    const cor = readline.question('Cor: ')

    const veiculo = new Veiculo(placa, modelo, marca, cor)
    sistema.addVeiculo(veiculo, condutor.id)
    console.log('Veiculo cadastrado')
}

function pagarMulta(sistema, condutor) {
    const multaId = readline.questionInt('ID da multa: ')
    sistema.pagarMulta(condutor.id, multaId)
    console.log('Multa paga')
}

function recorrerMulta(sistema, condutor) {
    const multaId = readline.questionInt('ID da multa: ')
    sistema.recorrerMulta(condutor.id, multaId)
    console.log('Multa recorrida')
}

function aplicarMulta(sistema, agente) {
    const placa = readline.question('Placa do veiculo: ')
    const tipo = readline.question('Tipo da infracao: ')
    const valor = readline.questionFloat('Valor: ')
    sistema.registrarMulta(agente, placa, tipo, valor)
    console.log('Multa registrada')
}

function alterarStatusMulta(sistema, agente) {
    const multaId = readline.questionInt('ID da multa: ')
    const status = readline.question('Novo status: ')
    sistema.alterarStatusMulta(agente, multaId, status)
    console.log('Status atualizado')
}

function buscarVeiculoPorPlaca(sistema,placa){
    const placa = readline.question('Placa:')
    sistema.buscarVeiculoPorPlaca(placa)
    console.log('Buscando placa...')
}

function listarMeusVeiculos(sistema, condutor) {
    const veiculos = sistema.listarVeiculosPorUsuario(condutor.id)
    if (veiculos.length === 0) {
        console.log('Nenhum veiculo cadastrado')
        return
    }
    console.log(veiculos)
}

function removerVeiculo(sistema, condutor) {
    const placa = readline.question('Placa do veiculo: ')
    sistema.removerVeiculo(condutor.id, placa)
    console.log('Veiculo removido com sucesso')
}

function atualizarSenha(sistema, condutor) {
    const senhaAtual = readline.question('Senha atual: ')
    const novaSenha = readline.question('Nova senha: ')

    sistema.atualizarSenha(condutor.id, senhaAtual, novaSenha)
    console.log('Senha atualizada com sucesso')
}

function atualizarEmail(sistema, condutor) {
    const novoEmail = readline.question('Novo email: ')
    sistema.atualizarEmail(condutor.id, novoEmail)
    console.log('Email atualizado com sucesso')
}

module.exports = {menuPrincipal}
