// Classe base para todos os tipos de usuários
class Usuario {
    #senha // senha privada (encapsulamento)

    constructor(id, nome, cpf, email, senha) {
        this.id = id
        this.nome = nome
        this.cpf = cpf
        this.email = email
        this.#senha = senha
    }

    // Verifica se a senha informada é a correta
    login(senha) {
        return this.#senha === senha
    }

    // Permite atualizar a senha do usuário
    atualizarSenha(novaSenha) {
        this.#senha = novaSenha
    }
}

module.exports = Usuario
