import { ParseSuccess } from '../parser/parseResult'
import { DocumentId } from './documentId'
import { AutoIncrementAttribute } from './field/autoIncrementAttribute'
import { EnumeratedAttribute } from './field/enumeratedAttribute'
import { FakerAttribute } from './field/fakerAttribute'

describe('DocumentId', () => {
  test.each([
    [':{auto}', new AutoIncrementAttribute(1)],
    [': {{random.word}}', new FakerAttribute('random.word')],
    [': (abc)', new EnumeratedAttribute(['abc'])],
    [': var', new EnumeratedAttribute(['var'])],
    [': $var', new EnumeratedAttribute(['$var'])],
  ])('parse', (input, value) =>
    expect(DocumentId.parser.parse(input)).toStrictEqual(new ParseSuccess(new DocumentId(value), ''))
  )
})
