import assert from 'assert'
import { IParser } from '../parser/iParser'
import { isNotNull } from '../parser/parser'
import * as P from '../parser/parser'
import { inCurlyBraces, spaces, wrapWSs } from '../parser/utilityParsers'

export class Generate {
  contents: number | { [id: string]: unknown }

  constructor(contents: number | string) {
    if (typeof contents === 'number') {
      this.contents = contents
    } else {
      this.contents = JSON.parse(contents)
    }
  }

  static get parser(): IParser<Generate> {
    const content = (layer: number): IParser<unknown> => {
      assert(layer >= 0)
      if (layer == 0) {
        return inCurlyBraces(P.many(wrapWSs(P.match(/[^{}]/))))
      } else {
        return inCurlyBraces(P.many(wrapWSs(P.or([P.match(/[^{}]/), content(layer - 1)]))))
      }
    }

    const decl = P.ignore(P.double(P.string('generate'), spaces))
    const num = P.map(P.match(/\d+/), v => Number(v))
    const jsonString = P.container(content(4))
    const contents = P.or<number | string>([num, jsonString])
    return P.map(P.double(decl, contents), v => new Generate(v[1]))
  }

  docs(): { [key: string]: unknown } {
    if (typeof this.contents === 'number') {
      return this.generateFakes(this.contents)
    } else {
      return this.contents
    }
  }

  private generateFakes(count: number): { [key: string]: unknown } {
    return {}
  }
}
