class Vehicle {

    constructor(weight, seats, maxSpeed) {
        this.weight = weight
        this.seats = seats
        this.maxSpeed = maxSpeed
    }

    // @bionic get weight Float
    // @bionic get seats Int
    // @bionic get maxSpeed Int

    get name() {
        return 'vehicle'
    }

    // @bionic String
    get description() {
        return `This ${this.name} has ${this.seats} seats, it weighs ${this.weight} kg, can reach ${this.maxSpeed} km/h`
    }

    get canTravelInTheSpace() {
        return false
    }
}

module.exports = {Vehicle}
