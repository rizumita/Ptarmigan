import * as P from '../parser/parser'
import { ParseSuccess } from './parseResult'
import { json } from './jsonParser'
import { ParseFailure } from '../parser/parser'

describe('JSONParser', () => {
  test.each([
    ['[1]', [1]],
    ['[ 1 ]', [1]],
    ['[1, 2]', [1, 2]],
    ['[1, "2"]', [1, '2']]
  ])('is succeeded', (input, value) =>
    expect(json(P.matchRegex(/.*/)).parse(input)).toStrictEqual(new ParseSuccess(value, ''))
  )

  test.each([['[1, 2,]', 'Unexpected token ] in JSON at position 6', '']])('is failed', (input, message, next) =>
    expect(json(P.matchRegex(/.*/)).parse(input)).toStrictEqual(new ParseFailure(message, next))
  )
})
