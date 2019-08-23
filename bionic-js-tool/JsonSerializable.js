class JsonSerializable {

    static fromObj(obj) {
        return Object.assign(new this(), obj)
    }

    static fromNullableObj(obj) {
        return obj === null ? null : this.fromObj(obj)
    }

    static fromObjList(objList) {
        return objList.map(obj => this.fromObj(obj))
    }

    static fromJson(json) {
        try {
            return this.fromObj(JSON.parse(json))
        } catch (error) {
            throw new SyntaxError(`Cannot deserialize a ${this.name} from JSON:'${json}'`)
        }
    }

    static fromJsonList(json) {
        try {
            return this.fromObjList(JSON.parse(json))
        } catch (error) {
            throw new SyntaxError(`Cannot deserialize a list of ${this.name} from JSON:'${json}'`)
        }
    }

    static fromJsonNative(json) {
        try {
            return JSON.parse(json)
        } catch (error) {
            throw new SyntaxError(`Cannot deserialize native JSON:'${json}'`)
        }
    }

    static toJsonNative(obj) {
        return JSON.stringify(obj)
    }

    get toJson() {
        return JSON.stringify(this)
    }

    get clone() {
        return this.constructor.fromObj(this)
    }

    get isDefault() {
        return this.isEqualTo(this.constructor.default)
    }

    isEqualTo(otherObj) {
        return otherObj instanceof this.constructor && this.toJson === JSON.stringify(otherObj)
    }
}

module.exports = {JsonSerializable}