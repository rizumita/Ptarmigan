import { ParseSuccess } from '../../parser/parseResult'
import { ReferenceFieldType } from './referenceFieldType'

describe('ReferenceAttribute', () => {
  test.each([
    ['/col', ['col']],
    ['/col/', ['col']],
    ['/col/doc', ['col', 'doc']],
    ['/col/doc/col/doc', ['col', 'doc', 'col', 'doc']],
  ])('construct', (arg, path) => expect(new ReferenceFieldType(arg).path).toEqual(path))

  test.each([
    ['ref@/col', new ReferenceFieldType('/col')],
    ['ref@/col/', new ReferenceFieldType('/col')],
    ['ref@/col/doc', new ReferenceFieldType('/col/doc')],
    ['ref@/col/doc/col/doc', new ReferenceFieldType('/col/doc/col/doc')],
  ])('parse document reference', (input, value) =>
    expect(ReferenceFieldType.parser.parse(input)).toStrictEqual(new ParseSuccess(value, ''))
  )
})
