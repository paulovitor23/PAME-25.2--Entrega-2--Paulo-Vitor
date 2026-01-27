// Classe que representa uma multa aplicada a um condutor
class Multa {
    constructor(id, idCliente, tipo, valor, data, status) {
        this.id = id
        this.idCliente = idCliente
        this.tipo = tipo
        this.valor = valor
        this.data = data
        this.status = status // pendente, paga, cancelada
    }
}

module.exports = Multa
