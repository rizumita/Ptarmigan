import * as P from './parser/parser'
import { IParser } from './parser/parser'
import { Info } from './schema/info'
import { Constant } from './schema/constant'
import { ValueType } from './schema/valueType'
import { ComplexType } from './schema/complexType'
import { DocumentType } from './schema/documentType'
import { CollectionType } from './schema/CollectionType'

function wrapWSs(parser: IParser<any>) {
  return P.unwrap(P.triple(P.option(P.ignore(whitespaces)), parser, P.option(P.ignore(whitespaces))))
}

const space = P.string(' ')
const lineEnd = P.string('\n')
const whitespaces = P.many(P.or([space, lineEnd]))
const word = P.match(/\b\w+/)
const equal = P.string('=')
const sentence = P.match(/[\w ]+/)
const name = P.match(/\S+/)

const infoKey = P.string('info')
const constKey = P.string('const')
const typeKey = P.string('type')
const documentKey = P.string('document')
const collectionKey = P.string('collection')

const keyValue = P.unwrap(P.triple(word, P.ignore(wrapWSs(P.string(':'))), word))

function inCurlyBraces(parser: IParser<any>) {
  const dictStart = P.string('{')
  const dictEnd = P.string('}')
  return P.unwrap(P.unwrap(P.seq([P.ignore(dictStart), parser, P.ignore(wrapWSs(dictEnd))])))
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
      word
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
      P.option(P.ignore(P.many(space))),
      P.ignore(equal),
      P.ignore(P.many(space)),
      inCurlyBraces(P.many(wrapWSs(keyValue)))
    ])
  )
)

const document = P.typed(DocumentType, P.unwrap(P.seq([wrapWSs(documentKey), wrapWSs(name)])))
function collectionParser(document: IParser<any>) {
  return P.typed(CollectionType, P.unwrap(P.seq([wrapWSs(collectionKey), wrapWSs(name), inCurlyBraces(document)])))
}
function documentParser(collection: IParser<any>) {
  return P.typed(
    DocumentType,
    P.unwrap(P.seq([wrapWSs(documentKey), wrapWSs(name), P.option(inCurlyBraces(collection))]))
  )
}
export const colDocParser = collectionParser(
  documentParser(collectionParser(documentParser(collectionParser(documentParser(collectionParser(document))))))
)

export const schemaParser = P.many(
  wrapWSs(P.or([infoParser, constParser, valueTypeParser, complexTypeParser, colDocParser]))
)
