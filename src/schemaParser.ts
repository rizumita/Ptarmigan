import * as P from './parser/parser'
import { IParser } from './parser/parser'

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
const declarationStop = P.ignore(P.or([lineEnd, P.end()]))

const constKey = P.string('const')
const typeKey = P.string('type')
const documentKey = P.string('document')
const collectionKey = P.string('collection')

const keyValue = P.unwrap(P.seq([wrapWSs(word), P.ignore(wrapWSs(P.string(':'))), wrapWSs(word)]))

function inDict(parser: IParser<any>) {
  const dictStart = P.string('{')
  const dictEnd = P.string('}')
  return P.unwrap(P.unwrap(P.seq([P.ignore(wrapWSs(dictStart)), parser, P.ignore(wrapWSs(dictEnd))])))
}

export const itemParser = P.unwrap(P.seq([wrapWSs(word), P.ignore(wrapWSs(equal)), wrapWSs(sentence), declarationStop]))
export const constParser = P.unwrap(
  P.seq([wrapWSs(constKey), wrapWSs(word), P.ignore(wrapWSs(equal)), wrapWSs(word), declarationStop])
)
export const typeParser = P.unwrap(
  P.seq([
    wrapWSs(typeKey),
    wrapWSs(word),
    P.ignore(wrapWSs(equal)),
    P.or([inDict(P.many(keyValue)), word]),
    declarationStop
  ])
)

const document = P.unwrap(P.seq([wrapWSs(documentKey), wrapWSs(name)]))
function collectionParser(document: IParser<any>) {
  return P.unwrap(P.seq([wrapWSs(collectionKey), wrapWSs(name), inDict(document)]))
}
function documentParser(collection: IParser<any>) {
  return P.unwrap(P.seq([wrapWSs(documentKey), wrapWSs(name), P.option(inDict(collection))]))
}
export const colDocParser = collectionParser(
  documentParser(collectionParser(documentParser(collectionParser(documentParser(collectionParser(document))))))
)
