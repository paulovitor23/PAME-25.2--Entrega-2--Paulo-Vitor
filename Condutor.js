const Usuario = require('./Usuario')

// Condutor é um tipo específico de usuário
class Condutor extends Usuario {
    constructor(id, nome, cpf, email, senha, data_nascimento) {
        super(id, nome, cpf, email, senha)
        this.data_nascimento = data_nascimento
    }
}

module.exports = Condutor
