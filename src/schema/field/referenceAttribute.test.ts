import { ParseSuccess } from '../../parser/parseResult'
import { ReferenceAttribute } from './referenceAttribute'

describe('ReferenceAttribute', () => {
  test.each([
    ['/col/doc', ['col', 'doc']],
    ['/col/doc/col/doc', ['col', 'doc', 'col', 'doc']],
  ])('construct', (arg, path) => expect(new ReferenceAttribute(arg).path).toEqual(path))

  test.each([['/col'], ['/col/'], ['/col/doc/col'], ['/col/doc/col/']])("can't construct", arg =>
    expect(() => new ReferenceAttribute(arg).path).toThrow('')
  )

  test.each([
    ['@/col/doc', new ReferenceAttribute('/col/doc')],
    ['@/col/doc/col/doc', new ReferenceAttribute('/col/doc/col/doc')],
  ])('parse document reference', (input, value) =>
    expect(ReferenceAttribute.parser.parse(input)).toStrictEqual(new ParseSuccess(value, ''))
  )

  test.each([['@/col'], ['@/col/doc/col']])("can't parse collection reference", input =>
    expect(() => ReferenceAttribute.parser.parse(input)).toThrow('')
  )
})
