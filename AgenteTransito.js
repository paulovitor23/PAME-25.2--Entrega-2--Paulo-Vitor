const Usuario = require('./Usuario')

// Agente de trânsito também herda de Usuário
class AgenteTransito extends Usuario {
    constructor(id, nome, cpf, email, senha, matricula) {
        super(id, nome, cpf, email, senha)
        this.matricula = matricula
    }
}

module.exports = AgenteTransito
