import { Parser } from './parser'
import { ParseFailuer, ParseResult, ParseSuccess } from './parseResult'

export class OrParser implements Parser<[Array<any>]> {
  psArray: Parser<any>[]

  constructor(psArray: Parser<any>[]) {
    this.psArray = psArray
  }

  parse(input: string): ParseResult<any> {
    for (const i in this.psArray) {
      const psresult = this.psArray[i].parse(input)

      if (psresult instanceof ParseSuccess) {
        return new ParseSuccess<any>(psresult.value, psresult.next)
      }
    }

    return new ParseFailuer<any>('', input)
  }
}

export function or(psArray: Parser<any>[]) {
  return new OrParser(psArray)
}
