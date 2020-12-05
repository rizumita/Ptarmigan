import { IParser } from './iParser'
import { ParseFailuer, ParseResult, ParseSuccess } from './parseResult'

export class StopWordParser implements IParser<string> {
  stopWords: string[]

  constructor(stopWords: string[]) {
    this.stopWords = stopWords
  }

  words(input: string): string {
    const indexs = this.stopWords
      .map((s) => Number(input.indexOf(s)))
      .filter((i) => i >= 0)
      .sort((a, b) => a - b)

    switch (indexs.length) {
      case 0:
        return input
      default:
        return input.substring(0, indexs[0])
    }
  }

  parse(input: string): ParseResult<string> {
    const muchString = this.words(input)

    if (muchString.length > 0) {
      return new ParseSuccess(muchString, input.substring(muchString.length))
    } else {
      return new ParseFailuer<any>('much stop word: ' + this.stopWords.toString(), input)
    }
  }
}

export function stop(stopWords: string[]) {
  return new StopWordParser(stopWords)
}
