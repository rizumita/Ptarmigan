import { ParseSuccess } from '../../parser/parseResult'
import { ReferenceAttribute } from './referenceAttribute'

describe('ReferenceAttribute', () => {
  test.each([
    ['/col', ['col']],
    ['/col/', ['col']],
    ['/col/doc', ['col', 'doc']],
    ['/col/doc/col/doc', ['col', 'doc', 'col', 'doc']],
  ])('construct', (arg, path) => expect(new ReferenceAttribute(arg).path).toEqual(path))

  test.each([
    ['@/col', new ReferenceAttribute('/col')],
    ['@/col/', new ReferenceAttribute('/col')],
    ['@/col/doc', new ReferenceAttribute('/col/doc')],
    ['@/col/doc/col/doc', new ReferenceAttribute('/col/doc/col/doc')],
  ])('parse document reference', (input, value) =>
    expect(ReferenceAttribute.parser.parse(input)).toStrictEqual(new ParseSuccess(value, ''))
  )
})
