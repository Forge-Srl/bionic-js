class JsonSerializable {

    static fromObj(obj) {
        if (this.getDeserializationInfo && obj) {
            const info = this.getDeserializationInfo()
            const classId = obj[info.idField]
            const classFactory = info.ids[classId]
            if (classFactory) {
                const ObjectClass = classFactory()

                // static getDeserializationInfo should not be inherited
                if (this.getDeserializationInfo === ObjectClass.getDeserializationInfo)
                    ObjectClass.getDeserializationInfo = undefined

                // static fromSuperObj should not be inherited
                if (this.fromSuperObj === ObjectClass.fromSuperObj)
                    ObjectClass.fromSuperObj = undefined

                return ObjectClass.fromObj(obj)
            }
        }

        return this.fromSuperObj ? this.fromSuperObj(obj) : Object.assign(new this(), obj)
    }

    static fromObjList(objList) {
        return objList.map(obj => this.fromObj(obj))
    }

    static fromJson(json) {
        try {
            return this.fromObj(JSON.parse(json))
        } catch (error) {
            throw new Error(`Cannot deserialize a ${this.name} from JSON:'${json}'`)
        }
    }

    static fromJsonList(json) {
        try {
            return this.fromObjList(JSON.parse(json))
        } catch (error) {
            throw new Error(`Cannot deserialize a list of ${this.name} from JSON:'${json}'`)
        }
    }

    static fromJsonNative(json) {
        try {
            return JSON.parse(json)
        } catch (error) {
            throw new Error(`Cannot deserialize native JSON:'${json}'`)
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

module.exports = JsonSerializable