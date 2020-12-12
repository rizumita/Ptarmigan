import { IParser } from '../../parser/iParser'
import * as P from '../../parser/parser'
import { InvalidSchemaError } from '../invalidSchemaError'

export class ArrayAttribute {
  count: number

  constructor(count: number) {
    if (count < 0) throw new InvalidSchemaError('ArrayAttribute needs positive number:' + count)

    this.count = count
  }

  static get parser(): IParser<ArrayAttribute> {
    return P.map(
      P.triple(
        P.string('['),
        P.map(P.match(/-?\d*/), v => Number(v)),
        P.string(']')
      ),
      v => new ArrayAttribute(v[1])
    )
  }
}

// setFakeTo(doc: { [id: string]: unknown }): void {
//   if (this.fakeNumber == null) return
//
// const array: unknown[] = []
// for (let i = 0; i < this.fakeNumber; i++) {
//   if (this.valueType instanceof SimpleValueType) {
//     const fake = this.valueType.valueType.getFake()
//     if (fake == null) continue
//     array.push(fake)
//   } else if (Array.isArray(this.valueType)) {
//     const dict: { [key: string]: unknown } = {}
//     for (const valueType of this.valueType) {
//       valueType.setFakeTo(dict)
//     }
//     array.push(dict)
//   }
// }
// // doc[this.valueType.name] = array
// }
