function toDegMinSec(coordinate) {
    const absolute = Math.abs(coordinate)
    const deg = Math.floor(absolute)
    const minNotTruncated = (absolute - deg) * 60
    const min = Math.floor(minNotTruncated)
    const sec = Math.floor((minNotTruncated - min) * 60)
    return `${deg} ${min} ${sec}`
}

class GeoPoint {

    // @bionic (GeoPoint, GeoPoint) => Float
    static getKmDistance(point1, point2) {
        const φ1 = point1.latitude * Math.PI/180
        const φ2 = point2.latitude * Math.PI/180
        const Δλ = (point2.longitude - point1.longitude) * Math.PI/180
        return Math.acos(Math.sin(φ1) * Math.sin(φ2) + Math.cos(φ1) * Math.cos(φ2) * Math.cos(Δλ)) * 6371e3
    }

    // @bionic (Float, Float)
    constructor(latitude, longitude) {
        this.latitude = latitude
        this.longitude = longitude
    }

    // @bionic String
    get degMinSec() {
        const latDegMinSec = toDegMinSec(this.latitude)
        const lonDegMinSec = toDegMinSec(this.longitude)
        return `${latDegMinSec} ${this.latitude >= 0 ? "N" : "S"}, ${lonDegMinSec} ${this.longitude >= 0 ? "E" : "W"}`
    }

    // @bionic String
    get coordinates() {
        return `${this.latitude}, ${this.longitude}`
    }
}

module.exports = {GeoPoint}