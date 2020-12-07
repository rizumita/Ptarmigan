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

function wrapWSs(parser: IParser<any>) {
  return P.unwrap(P.triple(P.option(P.ignore(whitespaces)), parser, P.option(P.ignore(whitespaces))))
}

const space = P.string(' ')
const spaces = P.many(space)
const lineEnd = P.string('\n')
const whitespaces = P.many(P.or([space, lineEnd]))
const word = P.match(/\b[\w\.]+/)
const equal = P.string('=')
const sentence = P.match(/[\w ]+/)
const name = P.match(/[\w]+/)

const infoKey = P.string('info')
const localeKey = P.string('locale')
const constKey = P.string('const')
const typeKey = P.string('type')
const fakeKey = P.string('fake')
const documentKey = P.string('document')
const collectionKey = P.string('collection')

const keyValue = P.unwrap(P.triple(word, P.ignore(wrapWSs(P.string(':'))), word))

function inCurlyBraces(parser: IParser<any>) {
  const dictStart = P.string('{')
  const dictEnd = P.string('}')
  return P.unwrap(
    P.unwrap(P.seq([P.ignore(dictStart), P.ignore(whitespaces), parser, P.ignore(whitespaces), P.ignore(dictEnd)]))
  )
}

export const infoParser = P.typed(
  Info,
  P.unwrap(
    P.seq([
      infoKey,
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
  P.unwrap(
    P.seq([localeKey, P.option(P.ignore(P.many(space))), P.ignore(equal), P.option(P.ignore(P.many(space))), word])
  )
)
export const constParser = P.typed(
  Constant,
  P.unwrap(
    P.seq([
      constKey,
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
      typeKey,
      P.ignore(P.many(space)),
      P.stop([' ', '=']),
      P.option(P.ignore(P.many(space))),
      P.ignore(equal),
      P.ignore(P.many(space)),
      word,
      P.option(P.unwrap(P.double(P.ignore(P.string('@')), word)))
    ])
  )
)
export const complexTypeParser = P.typed(
  ComplexType,
  P.unwrap(
    P.seq([
      typeKey,
      P.ignore(P.many(space)),
      P.stop([' ', '=']),
      P.option(P.ignore(spaces)),
      P.ignore(equal),
      P.ignore(P.many(space)),
      inCurlyBraces(P.many(wrapWSs(keyValue)))
    ])
  )
)

export const fakeParser = P.typed(
  Fake,
  P.unwrap(P.seq([fakeKey, P.ignore(P.string(':')), P.option(P.ignore(spaces)), word]))
)

function createCollectionParser(document: IParser<any>) {
  return P.typed(
    CollectionType,
    P.unwrap(
      P.seq([
        collectionKey,
        P.ignore(spaces),
        name,
        P.option(P.ignore(spaces)),
        inCurlyBraces(P.many(wrapWSs(P.or([fakeParser, document]))))
      ])
    )
  )
}
function createDocumentParser(collection: IParser<any>) {
  return P.typed(
    DocumentType,
    P.unwrap(
      P.seq([
        documentKey,
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

export const schemaParser = P.many(
  wrapWSs(P.or([infoParser, localeParser, constParser, valueTypeParser, complexTypeParser, collectionParser]))
)
