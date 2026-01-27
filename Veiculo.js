// Classe que representa um veículo do sistema
class Veiculo {
    constructor(placa, modelo, marca, cor) {
        this.placa = placa
        this.modelo = modelo
        this.marca = marca
        this.cor = cor
        // o proprietário será associado depois pelo Sistema
    }
}

module.exports = Veiculo
