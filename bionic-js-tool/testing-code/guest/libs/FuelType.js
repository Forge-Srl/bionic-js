class FuelType {

    // @bionic FuelType
    static get Electricity() {
        return new FuelType('electricity', 0.2)
    }

    // @bionic FuelType
    static get NaturalGas() {
        return new FuelType('natural gas', 0.4)
    }

    // @bionic FuelType
    static get Diesel() {
        return new FuelType('diesel', 0.6)
    }

    // @bionic FuelType
    static get Petrol() {
        return new FuelType('petrol', 0.8)
    }

    // @bionic FuelType
    static get Kerosene() {
        return new FuelType('kerosene', 1.0)
    }
    
    constructor(name, cost) {
        this.name = name
        this.cost = cost
    }

    // @bionic get name String
    // @bionic get cost Float
}

module.exports = {FuelType}
