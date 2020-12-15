import { IParser } from '../../parser/iParser'
import * as P from '../../parser/parser'
import { inParentheses } from '../../parser/utilityParsers'
import { DataGeneratable } from './dataGeneratable'

export class EnumeratedAttribute implements DataGeneratable {
  values: (string | number)[]
  private index = 0

  constructor(values: (string | number)[]) {
    this.values = values
  }

  get length(): number {
    return this.values.length
  }

  data(): string | number {
    if (this.index >= this.length) {
      this.index = 0
    }
    const i = this.index
    this.index++
    return this.values[i]
  }

  static get parser(): IParser<EnumeratedAttribute> {
    return P.map(inParentheses(P.match(/[^()]+/)), v => {
      const values = v.split('|')
      const mapped = values.map(v => {
        const num = Number(v)
        return isNaN(num) ? removeQuote(v) : num
      })
      return new EnumeratedAttribute(mapped)
    })
  }
}

const removeQuote = (value: string): string => {
  let v = value
  if (value.startsWith("'")) v = v.substring(1)
  if (value.endsWith("'")) v = v.substring(0, 1)
  return v
}
