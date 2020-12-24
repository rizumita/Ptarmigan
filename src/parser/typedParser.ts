import { IParser } from './iParser'
import { ParseFailure, ParseResult, ParseSuccess } from './parseResult'

export interface TypedValue {}

export interface TypedConstructor<T extends TypedValue> {
  new (value: any): T
}

export class TypedParser<V, T extends TypedValue> implements IParser<T> {
  ctor: TypedConstructor<T>
  parser: IParser<any>

  constructor(ctor: TypedConstructor<T>, parser: IParser<any>) {
    this.ctor = ctor
    this.parser = parser
  }

  parse(input: string): ParseResult<T> {
    const result = this.parser.parse(input)

    if (result instanceof ParseSuccess) {
      try {
        const value = new this.ctor(result.value)
        return new ParseSuccess(value, result.next)
      } catch (e) {
        return new ParseFailure(this.ctor.toString() + 'can not parse: ' + result.value, result.next)
      }
    } else {
      return result
    }
  }
}

export function typed<V, T extends TypedValue>(ctor: TypedConstructor<T>, parser: IParser<any>) {
  return new TypedParser<V, T>(ctor, parser)
}
