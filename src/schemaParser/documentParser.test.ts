import { createCollectionParser, createDocumentParser } from './schemaParser'
import * as P from '../parser/parser'
import { space, spaces } from './utilityParsers'
import { ParseIgnored, ParseSuccess } from '../parser/parser'
import { DocumentType } from '../schema/documentType'
import { CollectionType } from '../schema/collectionType'
import { ValueType } from '../schema/valueType'
import { Fake } from '../schema/fake'
import { Generate } from '../schema/generate'

describe('Parsing document', () => {
  test.each([['document']])('is ignored', (input) =>
    expect(
      createDocumentParser(P.option(createCollectionParser(P.ignore(P.option(spaces))))).parse(input)
    ).toStrictEqual(new ParseIgnored(''))
  )

  test.each([
    ['document{}', new DocumentType([])],
    ['document { }', new DocumentType([])],
    [`document { collection dummies {} }`, new DocumentType([new CollectionType(['dummies', []])])],
    [
      `document {
  title: string@name.title
  fake 50
  generate {
    "id1" : { "title" : "Hello, world!" }
  }
  collection dummies {}
}`,
      new DocumentType([
        new ValueType(['title', 'string', 'name.title']),
        new Fake(50),
        new Generate('{"id1" : { "title" : "Hello, world!" }}'),
        new CollectionType(['dummies', []]),
      ]),
    ],
  ])('is succeeded', (input, value) =>
    expect(
      createDocumentParser(P.option(createCollectionParser(P.ignore(P.option(spaces))))).parse(input)
    ).toStrictEqual(new ParseSuccess(value, ''))
  )
})
