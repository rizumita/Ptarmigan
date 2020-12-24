import * as P from '../parser/parser'
import { ParseSuccess } from './parseResult'
import { json } from './jsonParser'
import { ParseFailure } from './parseResult'

describe('JSONParser', () => {
  test.each([['[1]'], ['[ 1 ]'], ['[1, 2]'], ['[1, "2"]']])('is succeeded', input =>
    expect(json(P.match(/.*/)).parse(input)).toStrictEqual(new ParseSuccess(JSON.parse(input), ''))
  )

  test.each([['[1, 2,]', 'Unexpected token ] in JSON at position 6', '']])('is failed', (input, message, next) =>
    expect(json(P.match(/.*/)).parse(input)).toStrictEqual(new ParseFailure<JSON>(message, next))
  )
})
