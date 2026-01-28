
const AgenteTransito = require('./AgenteTransito')
const Multa = require('./Multa')
const Condutor = require('./Condutor')

// Classe responsável por centralizar a lógica do sistema
class Sistema {

    constructor() {
        // Mapas para facilitar buscas por chave
        this.usuarios = new Map()   // key: id
        this.veiculos = new Map()   // key: placa
        this.multas = new Map()     // key: id

        // Contadores simples para gerar IDs
        this._nextUsuarioId = 1
        this._nextMultaId = 1
    }

    gerarIdUsuario() {
        return this._nextUsuarioId++
    }

    gerarIdMulta() {
        return this._nextMultaId++
    }

    // Cadastra um usuário no sistema
    addUsuario(usuario) {
        if (!usuario.id) {
            usuario.id = this.gerarIdUsuario()
        }

        // Verifica duplicidade de CPF e email
        for (const u of this.usuarios.values()) {
            if (u.cpf === usuario.cpf) {
                throw new Error('CPF já cadastrado')
            }
            if (u.email === usuario.email) {
                throw new Error('Email já cadastrado')
            }
        }

        this.usuarios.set(usuario.id, usuario)
        return usuario.id
    }

    // Busca direta pelo ID (Map facilita isso)
    buscarUsuarioPorId(id) {
        return this.usuarios.get(id) || null
    }

    // Autentica o usuário verificando a senha
    autenticar(id, senha) {
        const u = this.buscarUsuarioPorId(id)
        if (!u) return null
        return u.login(senha) ? u : null
    }

    // Associa um veículo a um usuário
    addVeiculo(veiculo, usuarioId) {
        if (this.veiculos.has(veiculo.placa)) {
            throw new Error('Veículo já cadastrado')
        }

        const user = this.usuarios.get(usuarioId)
        if (!user) {
            throw new Error('Usuário não encontrado')
        }

        veiculo.proprietarioId = usuarioId
        this.veiculos.set(veiculo.placa, veiculo)
    }

    buscarVeiculoPorPlaca(placa) {
    return this.veiculos.get(placa) || null
    }

    removerVeiculo(usuarioId, placa) {
    const veiculo = this.veiculos.get(placa)
    if (!veiculo) throw new Error('Veículo não encontrado')
    if (veiculo.proprietarioId !== usuarioId) {
        throw new Error('Não autorizado')
    }

    this.veiculos.delete(placa)
    return true
    }

    // Lista todos os veículos de um usuário
    listarVeiculosPorUsuario(usuarioId) {
        const res = []
        for (const v of this.veiculos.values()) {
            if (v.proprietarioId === usuarioId) {
                res.push(v)
            }
        }
        return res
    }

    listarTodosVeiculos(agente) {
    if (!(agente instanceof AgenteTransito)) {
        throw new Error('Apenas agentes podem listar todos os veículos')
    }
    return Array.from(this.veiculos.values())
    }

    listarTodosCondutores(agente) {
    if (!(agente instanceof AgenteTransito)) {
        throw new Error('Apenas agentes podem listar condutores')
    }

    const condutores = []

    for (const u of this.usuarios.values()) {
        if (u instanceof Condutor) {
            condutores.push(u)
        }
    }

    return condutores
}


    // Registra uma multa (somente agente pode fazer isso)
    registrarMulta(agente, placa, tipo, valor, data = new Date().toISOString()) {
        if (!(agente instanceof AgenteTransito)) {
            throw new Error('Apenas agentes podem registrar multas')
        }

        const veic = this.veiculos.get(placa)
        if (!veic) {
            throw new Error('Veículo não encontrado')
        }

        const id = this.gerarIdMulta()
        const multa = new Multa(
            id,
            veic.proprietarioId,
            tipo,
            valor,
            data,
            'pendente'
        )

        this.multas.set(id, multa)
        return multa
    }

    // Permite que o condutor pague sua multa
    pagarMulta(usuarioId, multaId) {
        const multa = this.multas.get(multaId)
        if (!multa) throw new Error('Multa não encontrada')
        if (multa.idCliente !== usuarioId) throw new Error('Não autorizado')
        if (multa.status !== 'pendente') throw new Error('Multa não pendente')

        multa.status = 'paga'
        return multa
    }

    // Cancelamento de multa (somente agente)
    cancelarMulta(agente, multaId) {
        if (!(agente instanceof AgenteTransito)) {
            throw new Error('Apenas agentes podem cancelar multas')
        }

        const multa = this.multas.get(multaId)
        if (!multa) throw new Error('Multa não encontrada')

        multa.status = 'cancelada'
        return multa
    }

    recorrerMulta(usuarioId,multaId){
        const multa = this.multas.get(multaId)

        if(!multa){
            throw new Error('Multa nao encontrada')
        }
        
        if (multa.idCliente !== usuarioId){
            throw new Error('Nao autorizado a recorrer esta multa')
        }

        if (multa.status !== 'pendente'){
            throw new Error('Apenas multas pendentes podem ser recorridas')
        }

        multa.status = 'recorrida'
        return multa
    }



    // Lista todas as multas de um usuário
    listarMultasPorUsuario(usuarioId) {
        const res = []
        for (const m of this.multas.values()) {
            if (m.idCliente === usuarioId) {
                res.push(m)
            }
        }
        return res
    }

    listarTodasMultas(agente){
        if(!(agente instanceof AgenteTransito)){
            throw new Error ('Apenas agentes podem listar todas as multas')
        }
        return Array.from(this.multas.values())
    }

    alterarStatusMulta(agente, multaId, novoStatus) {
    if (!(agente instanceof AgenteTransito)) {
        throw new Error('Apenas agentes podem alterar o status da multa')
    }

    const multa = this.multas.get(multaId)
    if (!multa) throw new Error('Multa não encontrada')

    const statusValidos = ['pendente', 'paga', 'cancelada', 'recorrida']
    if (!statusValidos.includes(novoStatus)) {
        throw new Error('Status inválido')
    }

    multa.status = novoStatus
    return multa
    }

    // Atualiza a senha após validação da senha atual
    atualizarSenha(usuarioId, senhaAtual, novaSenha) {
        const u = this.usuarios.get(usuarioId)
        if (!u) throw new Error('Usuário não encontrado')
        if (!u.login(senhaAtual)) throw new Error('Senha atual incorreta')

        u.atualizarSenha(novaSenha)
        return true
    }
    
    atualizarEmail(usuarioId, novoEmail) {
        for (const u of this.usuarios.values()) {
            if (u.email === novoEmail) {
                throw new Error('Email já cadastrado')
            }
        }

        const u = this.usuarios.get(usuarioId)
        if (!u) throw new Error('Usuário não encontrado')

        u.email = novoEmail
        return true
    }

}


module.exports = Sistema
