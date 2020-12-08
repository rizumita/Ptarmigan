import { constParser } from './schemaParser'
import { ParseFailure, ParseSuccess } from '../parser/parseResult'
import { Constant } from '../schema/constant'

describe('Parsing const', () => {
  test.each([
    ['const Ver = v1', new Constant(['Ver', 'v1'])],
    ['const Ver  =  v2', new Constant(['Ver', 'v2'])],
    ['const Ver=v2', new Constant(['Ver', 'v2'])]
  ])('is succeeded', (input, value) => expect(constParser.parse(input)).toStrictEqual(new ParseSuccess(value, '')))

  test.each([['const Ver =', '/^[\\w\\.]+/ is not match', '']])('is failed', (input, message, next) =>
    expect(constParser.parse(input)).toStrictEqual(new ParseFailure(message, next))
  )
})
