import { ParseSuccess } from '../parser/parseResult'
import { DocumentId } from './documentId'
import { AutoIncrementAttribute } from './field/autoIncrementAttribute'
import { EnumeratedAttribute } from './field/enumeratedAttribute'
import { FakerAttribute } from './field/fakerAttribute'

describe('DocumentId', () => {
  test.each([
    ['id: {auto}', new AutoIncrementAttribute(1)],
    ['id: {{random.word}}', new FakerAttribute('random.word')],
    ['id: (abc)', new EnumeratedAttribute(['abc'])],
    ['id: var', new EnumeratedAttribute(['var'])],
    ['id: $var', new EnumeratedAttribute(['$var'])],
  ])('parse', (input, value) =>
    expect(DocumentId.parser.parse(input)).toStrictEqual(new ParseSuccess(new DocumentId(value), ''))
  )
})
