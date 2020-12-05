import { IParser } from './iParser'
import { ParseFailuer, ParseResult, ParseSuccess } from './parseResult'

export class OrParser implements IParser<[Array<any>]> {
  psArray: IParser<any>[]

  constructor(psArray: IParser<any>[]) {
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

export function or(psArray: IParser<any>[]) {
  return new OrParser(psArray)
}
