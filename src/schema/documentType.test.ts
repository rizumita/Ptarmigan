import { ParseSuccess } from '../parser/parseResult'
import { DocumentType } from './documentType'
import { Field } from './field/field'
import { ValueFieldType } from './field/valueFieldType'

describe('DocumentType', () => {
  test.each([
    ['type User={}', new DocumentType('User', [])],
    ['type User = {}', new DocumentType('User', [])],
    [
      'type User = { firstName: string }',
      new DocumentType('User', [new Field('firstName', new ValueFieldType('string'))]),
    ],
  ])('parse', (input, value) => expect(DocumentType.parser.parse(input)).toStrictEqual(new ParseSuccess(value, '')))
})
