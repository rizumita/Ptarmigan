import { ParseSuccess } from '../parser/parseResult'
import { DocumentId } from './documentId'
import { AutoIncrementFieldType } from './field/autoIncrementFieldType'
import { EnumeratedFieldType } from './field/enumeratedFieldType'
import { FakerFieldType } from './field/fakerFieldType'

describe('DocumentId', () => {
  test.each([
    [':{auto}', new AutoIncrementFieldType('string', 1)],
    [': random.word', new FakerFieldType('string', 'random.word')],
    [': (abc)', new EnumeratedFieldType('string', ['abc'])],
    [': var', new EnumeratedFieldType('string', ['var'])],
    [': $var', new EnumeratedFieldType('string', ['$var'])],
  ])('parse', (input, value) =>
    expect(DocumentId.parser.parse(input)).toStrictEqual(new ParseSuccess(new DocumentId(value), ''))
  )

  test('trailing', () =>
    expect(DocumentId.parser.parse(': var = {}')).toStrictEqual(
      new ParseSuccess(new DocumentId(new EnumeratedFieldType('string', ['var'])), ' = {}')
    ))
})
