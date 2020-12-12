import { IParser } from '../../parser/iParser'
import { isNotNull } from '../../parser/parser'
import * as P from '../../parser/parser'

export class FakeAttribute {
  fakeType: string

  constructor(fakeType: string) {
    this.fakeType = fakeType
  }

  static get parser(): IParser<FakeAttribute> {
    const decl = P.ignore(P.string('%'))
    const type = P.match(/[\w.]+/)
    return P.map(P.double(decl, type), v => new FakeAttribute(v[1]))
  }
}

// getFake(): unknown {
//   return this.fakerType != null ? faker.fake(`{{${this.fakerType}}}`) : null
// }
