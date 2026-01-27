/* Classes necessarias para o funcionamento básico do case */

class Veiculo{
    constructor(placa,modelo,marca,cor){
        this.placa = placa
        this.modelo = modelo
        this.marca = marca
        this.cor = cor
    }
}

class Usuario{
    #senha
    constructor(id,nome,cpf,email,senha){
        this.id = id 
        this.nome = nome
        this.cpf = cpf
        this.email = email
        this.#senha = senha
    }
    login(senha) {
        return this.#senha === senha;
    }
    atualizarSenha(novaSenha){
        this.#senha = novaSenha
    }
}

class Condutor extends Usuario{
    constructor(id,nome,cpf,email,senha,data_nascimento){
        super(id,nome,cpf,email,senha)
        this.data_nascimento = data_nascimento
    }
}

class AgenteTransito extends Usuario{
    constructor(id,nome,cpf,email,senha,matricula){
        super(id,nome,cpf,email,senha)
        this.matricula = matricula
    }
}

class Multa{
    constructor(id,idCliente,tipo,valor,data,status){
        this.id = id
        this.idCliente = idCliente
        this.tipo = tipo
        this.valor = valor
        this.data = data
        this.status = status
    }
}


/* Implementacao da integracao entre atributos e metodos das classes implementadas */

class Sistema{

    constructor(){
        this.usuarios = new Map() // key: id
        this.veiculos = new Map() // key: placa
        this.multas = new Map()   // key: id
        this._nextUsuarioId = 1
        this._nextMultaId = 1
    }

    gerarIdUsuario(){
        return this._nextUsuarioId++
    }

    gerarIdMulta(){
        return this._nextMultaId++
    }

    addUsuario(usuario){
        if(!usuario.id) usuario.id = this.gerarIdUsuario()
        for(const u of this.usuarios.values()){
            if(u.cpf === usuario.cpf){
                console.log('CPF já cadastrado')
            }
            if(u.email === usuario.email){
                console.log('Email já cadastrado')
            }
        }
        this.usuarios.set(usuario.id, usuario)
        return usuario.id
    }

    autenticar(id,senha){
        const u = this.buscarUsuarioPorId(id)
        if(!u) return null
        return u.login(senha) ? u : null
    }
    
    buscarUsuarioPorId(id){
        return this.usuarios.get(id) || null
        
    }
    
    addVeiculo(veiculo, usuarioId){
        if(this.veiculos.has(veiculo.placa)) throw new Error('Veículo já cadastrado')
        const user = this.usuarios.get(usuarioId)
        if(!user) throw new Error('Usuário não encontrado')
        veiculo.proprietarioId = usuarioId
        this.veiculos.set(veiculo.placa, veiculo)
    }

    listarVeiculosPorUsuario(usuarioId){
        const res = []
        for(const v of this.veiculos.values()) if(v.proprietarioId === usuarioId) res.push(v)
        return res
    }

    registrarMulta(agente, placa, tipo, valor, data = new Date().toISOString()){
        if(!(agente instanceof AgenteTransito)) throw new Error('Apenas agentes podem registrar multas')
        const veic = this.veiculos.get(placa)
        if(!veic) throw new Error('Veículo não encontrado')
        const id = this.gerarIdMulta()
        const multa = new Multa(id, veic.proprietarioId, tipo, valor, data, 'pendente')
        this.multas.set(id, multa)
        return multa
    }

    pagarMulta(usuarioId, multaId){
        const multa = this.multas.get(multaId)
        if(!multa) throw new Error('Multa não encontrada')
        if(multa.idCliente !== usuarioId) throw new Error('Não autorizado')
        if(multa.status !== 'pendente') throw new Error('Multa não pendente')
        multa.status = 'paga'
        return multa
    }

    cancelarMulta(agente, multaId){
        if(!(agente instanceof AgenteTransito)) throw new Error('Apenas agentes podem cancelar multas')
        const multa = this.multas.get(multaId)
        if(!multa) throw new Error('Multa não encontrada')
        multa.status = 'cancelada'
        return multa
    }

    listarMultasPorUsuario(usuarioId){
        const res = []
        for(const m of this.multas.values()) if(m.idCliente === usuarioId) res.push(m)
        return res
    }

    atualizarSenha(usuarioId, senhaAtual, novaSenha){
        const u = this.usuarios.get(usuarioId)
        if(!u) throw new Error('Usuário não encontrado')
        if(!u.login(senhaAtual)) throw new Error('Senha atual incorreta')
        u.atualizarSenha(novaSenha)
        return true
    }
}


/* Teste */

if(require.main === module){
    const sistema = new Sistema()

    const condutor = new Condutor(null,'João','11122233344','joao@example.com','1234','1990-01-01')
    const agente = new AgenteTransito(null,'Maria','99988877766','maria@transito.com','abcd','M-001')

    const idCondutor = sistema.addUsuario(condutor)
    const idAgente = sistema.addUsuario(agente)

    const veic = new Veiculo('ABC-1234','Civic','Honda','Prata')
    sistema.addVeiculo(veic, idCondutor)

    const multa = sistema.registrarMulta(agente, 'ABC-1234', 'Excesso de velocidade', 250)
    console.log('Multa registrada:', multa)

    const multasDoCondutor = sistema.listarMultasPorUsuario(idCondutor)
    console.log('Multas do condutor:', multasDoCondutor)

    const autenticado = sistema.autenticar(idCondutor,'1234')
    console.log('Autenticado:', !!autenticado)
}