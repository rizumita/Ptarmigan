import { ParseSuccess } from '../parser/parseResult'
import { DocumentId } from './documentId'
import { DocumentType } from './documentType'
import { EnumeratedFieldType } from './field/enumeratedFieldType'
import { Field } from './field/field'

describe('DocumentType', () => {
  test.each([
    ['type User={}', new DocumentType('User', null, [])],
    ['type User = {}', new DocumentType('User', null, [])],
    [
      'type User: myself = {}',
      new DocumentType('User', new DocumentId(new EnumeratedFieldType('string', ['myself'])), []),
    ],
    [
      'type User = { firstName: string }',
      new DocumentType('User', null, [new Field('firstName', new EnumeratedFieldType('string', []))]),
    ],
  ])('parse', (input, value) => expect(DocumentType.parser.parse(input)).toStrictEqual(new ParseSuccess(value, '')))
})
