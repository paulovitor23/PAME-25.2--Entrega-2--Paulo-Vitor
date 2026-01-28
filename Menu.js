const readline = require('readline-sync');
const Condutor = require('./Condutor')
const AgenteTransito = require('./AgenteTransito')
const Veiculo = require('./Veiculo')

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
    const id = readline.question("ID: ")
    const senha = readline.question("Senha: ")

    const usuario = sistema.autenticar(id,senha)
}
function menuAgente(){}
function menuCondutor(){}

module.exports = { menuPrincipal, menuCondutor, menuAgente }
