import { IParser } from '../parser/iParser'
import * as P from '../parser/parser'

export class Comment {
  text: string

  constructor(text: string) {
    this.text = text
  }

  static get parser(): IParser<Comment> {
    return P.map(
      P.double(P.match(/\/\/\s*.*/), P.or([P.string('\n'), P.end()])),
      v => new Comment(v[0].substring(2).trim())
    )
  }
}
