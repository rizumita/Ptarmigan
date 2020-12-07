import { constParser } from './schemaParser'
import { ParseFailure, ParseSuccess } from '../parser/parseResult'
import { Constant } from '../schema/constant'

describe('Parsing const', () => {
  test.each([
    ['const Ver = v1', new Constant(['const', 'Ver', 'v1'])],
    ['const Ver  =  v2', new Constant(['const', 'Ver', 'v2'])],
    ['const Ver=v2', new Constant(['const', 'Ver', 'v2'])]
  ])('is succeeded', (input, value) => expect(constParser.parse(input)).toStrictEqual(new ParseSuccess(value, '')))

  test.each([
    ['const Ver =', '/^\\b[\\w\\.]+/ is not match', ''],
    ['const Ver =\nv1', '/^\\b[\\w\\.]+/ is not match', '\nv1']
  ])('is failed', (input, message, next) =>
    expect(constParser.parse(input)).toStrictEqual(new ParseFailure(message, next))
  )
})
