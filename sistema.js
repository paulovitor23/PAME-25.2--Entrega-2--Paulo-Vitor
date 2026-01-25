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
}

class Condutor extends Usuario{
    #senha
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