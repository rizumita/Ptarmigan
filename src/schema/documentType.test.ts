import { ParseSuccess } from '../parser/parseResult'
import { DocumentId } from './documentId'
import { DocumentType } from './documentType'
import { EnumeratedAttribute } from './field/enumeratedAttribute'
import { Field } from './field/field'
import { ValueFieldType } from './field/valueFieldType'

describe('DocumentType', () => {
  test.each([
    ['type User={}', new DocumentType('User', null, [])],
    ['type User = {}', new DocumentType('User', null, [])],
    ['type User: myself = {}', new DocumentType('User', new DocumentId(new EnumeratedAttribute(['myself'])), [])],
    [
      'type User = { firstName: string }',
      new DocumentType('User', null, [new Field('firstName', new ValueFieldType('string'))]),
    ],
  ])('parse', (input, value) => expect(DocumentType.parser.parse(input)).toStrictEqual(new ParseSuccess(value, '')))
})
