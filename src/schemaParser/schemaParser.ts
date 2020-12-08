import * as P from '../parser/parser'
import { IParser } from '../parser/parser'
import { Info } from '../schema/info'
import { Constant } from '../schema/constant'
import { ValueType } from '../schema/valueType'
import { ComplexType } from '../schema/complexType'
import { DocumentType } from '../schema/documentType'
import { CollectionType } from '../schema/CollectionType'
import { Locale } from '../schema/locale'
import { Fake } from '../schema/fake'
import { Schema } from '../schema/schema'
import { Generate } from '../schema/generate'
import { dict, equal, inCurlyBraces, name, sentence, space, spaces, whitespaces, word, wrapWSs } from './utilityParsers'

const infoKey = P.string('info')
const localeKey = P.string('locale')
const constKey = P.string('const')
const typeKey = P.string('type')
const fakeKey = P.string('fake')
const generateKey = P.string('generate')
const documentKey = P.string('document')
const collectionKey = P.string('collection')

const keyValue = P.unwrap(P.triple(word, P.ignore(wrapWSs(P.string(':'))), word))

export const infoParser = P.typed(
  Info,
  P.unwrap(
    P.seq([
      P.ignore(infoKey),
      P.ignore(P.many(space)),
      P.stop([' ', '=']),
      P.option(P.ignore(P.many(space))),
      P.ignore(equal),
      P.ignore(P.many(space)),
      sentence
    ])
  )
)
export const localeParser = P.typed(
  Locale,
  P.unwrap(P.seq([P.ignore(localeKey), P.option(P.ignore(spaces)), P.ignore(equal), P.option(P.ignore(spaces)), word]))
)
export const constParser = P.typed(
  Constant,
  P.unwrap(
    P.seq([
      P.ignore(constKey),
      P.ignore(P.many(space)),
      P.stop([' ', '=']),
      P.option(P.ignore(P.many(space))),
      P.ignore(equal),
      P.ignore(P.many(space)),
      word
    ])
  )
)
export const valueTypeParser = P.typed(
  ValueType,
  P.unwrap(
    P.seq([
      P.ignore(typeKey),
      P.ignore(spaces),
      name,
      P.ignore(P.string(':')),
      P.ignore(spaces),
      name,
      P.option(P.unwrap(P.double(P.ignore(P.string('@')), word)))
    ])
  )
)
export const complexTypeParser = P.typed(
  ComplexType,
  P.unwrap(
    P.seq([
      P.ignore(typeKey),
      P.ignore(P.many(space)),
      name,
      P.ignore(P.string(':')),
      P.option(P.ignore(spaces)),
      inCurlyBraces(P.many(wrapWSs(keyValue)))
    ])
  )
)

export const fakeParser = P.typed(Fake, P.unwrap(P.double(P.ignore(P.double(fakeKey, spaces)), word)))

export const generateParser = P.typed(
  Generate,
  P.unwrap(P.seq([P.ignore(generateKey), P.option(P.ignore(spaces)), dict()]))
)

function createCollectionParser(document: IParser<any>) {
  return P.typed(
    CollectionType,
    P.unwrap(
      P.seq([
        P.ignore(P.double(collectionKey, spaces)),
        name,
        P.ignore(spaces),
        inCurlyBraces(P.many(wrapWSs(P.or([fakeParser, generateParser, document]))))
      ])
    )
  )
}

function createDocumentParser(collection: IParser<any>) {
  return P.typed(
    DocumentType,
    P.unwrap(
      P.seq([
        P.ignore(documentKey),
        P.ignore(spaces),
        name,
        P.option(P.ignore(spaces)),
        P.option(inCurlyBraces(P.option(collection)))
      ])
    )
  )
}

export const collectionParser = createCollectionParser(
  createDocumentParser(
    createCollectionParser(
      createDocumentParser(
        createCollectionParser(createDocumentParser(createCollectionParser(createDocumentParser(spaces))))
      )
    )
  )
)

export const schemaParser = P.typed(
  Schema,
  P.many(wrapWSs(P.or([infoParser, localeParser, constParser, complexTypeParser, valueTypeParser, collectionParser])))
)
