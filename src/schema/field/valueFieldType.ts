import { IParser } from '../../parser/iParser'
import * as P from '../../parser/parser'
import { ArrayAttribute } from './arrayAttribute'
import { FakeAttribute } from './fakeAttribute'
import { ReferenceAttribute } from './referenceAttribute'

export class ValueFieldType {
  type: string
  attribute: FakeAttribute | ReferenceAttribute | null
  arrayAttribute: ArrayAttribute | null

  constructor(
    type: string,
    attribute: FakeAttribute | ReferenceAttribute | null,
    arrayAttribute: ArrayAttribute | null = null
  ) {
    this.type = type
    this.attribute = attribute
    this.arrayAttribute = arrayAttribute
  }

  static get parser(): IParser<ValueFieldType> {
    return P.map<[string, FakeAttribute | ReferenceAttribute | null, ArrayAttribute | null], ValueFieldType>(
      P.triple(
        P.match(/\w+/),
        P.option(P.or([FakeAttribute.parser, ReferenceAttribute.parser])),
        P.option(ArrayAttribute.parser)
      ),
      v => new ValueFieldType(v[0], v[1] ?? null, v[2] ?? null)
    )
  }
}

// setFakeTo(doc: { [id: string]: unknown }): void {
//   const fake = this.valueType.getFake()
//   if (faker == null) return
// doc[this.name] = fake
// }
