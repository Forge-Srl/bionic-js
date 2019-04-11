const t = require('./common/index')

describe('JsonSerializable', () => {

    let JsonSerializable

    beforeEach(() => {

        JsonSerializable = t.requireModule('jsonSerializable')
    })

    test('fromObj base behavior', () => {

        class SerializedObj extends JsonSerializable {
        }

        const obj = SerializedObj.fromObj({prop1: 'test1', prop2: 'test2'})

        expect(obj).toBeInstanceOf(SerializedObj)
        expect(obj.prop1).toBe('test1')
        expect(obj.prop2).toBe('test2')
    })

    test('fromObjList', () => {

        class SerializedObj extends JsonSerializable {
            static fromObj(obj) {
                return `${obj.id}`
            }
        }

        const objList = SerializedObj.fromObjList([{id: 1}, {id: 2}])

        expect(objList).toEqual(['1', '2'])
    })

    test('fromJson', () => {

        const fromObj1 = t.mockFn(() => 'obj1')

        class Serializable1 extends JsonSerializable {
            static fromObj(obj) {
                return fromObj1(obj)
            }
        }

        const fromObj2 = t.mockFn(() => 'obj2')

        class Serializable2 extends Serializable1 {
            static fromObj(obj) {
                return fromObj2(obj)
            }
        }

        const res2 = Serializable2.fromJson('{"obj":2}')
        expect(res2).toBe('obj2')
        expect(fromObj2).toHaveBeenLastCalledWith({obj: 2})
        expect(fromObj1).not.toHaveBeenCalled()

        const res1 = Serializable1.fromJson('{"obj":1}')
        expect(res1).toBe('obj1')
        expect(fromObj1).toHaveBeenLastCalledWith({obj: 1})
        expect(fromObj2).toHaveBeenCalledTimes(1)
    })

    test('fromJson error', () => {

        class Serializable extends JsonSerializable {
        }

        expect(() => Serializable.fromJson('error'))
            .toThrow('Cannot deserialize a Serializable from JSON:\'error\'')
    })

    test('fromJsonList', () => {

        const fromObj = t.mockFn(() => 'obj')

        class Serializable extends JsonSerializable {
            static fromObj(obj) {
                return fromObj(obj)
            }
        }

        const res = Serializable.fromJsonList('["el1", "el2"]')
        expect(res).toEqual(['obj', 'obj'])
        expect(fromObj).toHaveBeenCalledTimes(2)
        expect(fromObj).toHaveBeenNthCalledWith(1, 'el1')
        expect(fromObj).toHaveBeenNthCalledWith(2, 'el2')
    })

    test('fromJsonList error', () => {

        class Serializable extends JsonSerializable {
        }

        expect(() => Serializable.fromJsonList('error'))
            .toThrow('Cannot deserialize a list of Serializable from JSON:\'error\'')
    })

    test('fromJsonNative', () => {

        const res = JsonSerializable.fromJsonNative('{"obj":2}')
        expect(res).toEqual({obj: 2})
    })

    test('fromJsonNative error', () => {

        expect(() => JsonSerializable.fromJsonNative('error'))
            .toThrow('Cannot deserialize native JSON:\'error\'')
    })

    test('toJson', () => {

        class Serializable extends JsonSerializable {
            constructor() {
                super()
                this.prop1 = 1
            }

            get prop2() {
                return 2
            }
        }

        Serializable.prop3 = 3

        const seri = new Serializable()
        seri.prop4 = 4
        seri.prop5 = () => 5

        expect(seri.toJson).toBe('{"prop1":1,"prop4":4}')
    })

    test('clone', () => {

        class Serializable1 extends JsonSerializable {
            constructor(prop1) {
                super()
                this.prop1 = prop1
            }

            static fromObj(obj) {
                return new Serializable1(obj.prop1)
            }
        }

        class Serializable2 extends Serializable1 {
            constructor(prop2, prop1) {
                super(prop1)
                this.prop2 = prop2
            }

            static fromObj(obj) {
                return new Serializable2(obj.prop2, obj.prop1)
            }
        }

        const serializable1 = new Serializable1(1)
        const serializable2 = new Serializable2(2, 1)

        const clone1 = serializable1.clone
        const clone2 = serializable2.clone

        expect(clone1).toBeInstanceOf(Serializable1)
        expect(clone1).not.toBe(serializable1)
        expect(clone1).toEqual(serializable1)

        expect(clone2).toBeInstanceOf(Serializable2)
        expect(clone2).not.toBe(serializable2)
        expect(clone2).toEqual(serializable2)
    })

    test('isDefault', () => {

        class Serializable extends JsonSerializable {
            constructor(prop1) {
                super()
                this.prop1 = prop1
            }

            static get default() {
                return new Serializable("prop1")
            }
        }

        expect(new Serializable('prop1').isDefault).toBe(true)
        expect(new Serializable('propX').isDefault).toBe(false)
    })

    test('isEqualTo', () => {

        class Serializable1 extends JsonSerializable {
            constructor(prop1) {
                super()
                this.prop1 = prop1
            }
        }

        class Serializable1Ext extends Serializable1 {
        }

        class Serializable2 extends JsonSerializable {
            constructor(prop1) {
                super()
                this.prop1 = prop1
            }
        }

        const serializable = new Serializable1('prop1')
        const objEqual1 = new Serializable1('prop1')
        const objEqual2 = new Serializable1Ext('prop1')
        const objNotEqual1 = new Serializable1Ext('XXXX')
        const objNotEqual2 = new Serializable2('prop1')
        const objNotEqual3 = {prop1: 'prop1'}
        const objNotEqual4 = {}

        expect(serializable.isEqualTo(objEqual1)).toBeTruthy()
        expect(serializable.isEqualTo(objEqual2)).toBeTruthy()
        expect(serializable.isEqualTo(objNotEqual1)).toBeFalsy()
        expect(serializable.isEqualTo(objNotEqual2)).toBeFalsy()
        expect(serializable.isEqualTo(objNotEqual3)).toBeFalsy()
        expect(serializable.isEqualTo(objNotEqual4)).toBeFalsy()
    })
})