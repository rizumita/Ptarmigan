import * as P from '../parser/parser'
import { IParser } from '../parser/parser'
import { Info } from '../schema/info'
import { Constant } from '../schema/constant'
import { ValueType } from '../schema/valueType'
import { DocumentType } from '../schema/documentType'
import { CollectionType } from '../schema/collectionType'
import { Locale } from '../schema/locale'
import { Fake } from '../schema/fake'
import { Schema } from '../schema/schema'
import { Generate } from '../schema/generate'
import {
  dict,
  endOfLine,
  equal,
  inCurlyBraces,
  name,
  projectIdPattern,
  sentence,
  space,
  spaces,
  typePatter,
  whitespaces,
  word,
  wrapWSs,
} from './utilityParsers'
import { ProjectId } from '../schema/projectId'

const projectIdKey = P.string('projectId')
const infoKey = P.string('info')
const localeKey = P.string('locale')
const constKey = P.string('const')
const fakeKey = P.string('fake')
const generateKey = P.string('generate')
const documentKey = P.string('document')
const collectionKey = P.string('collection')

const keyValue = P.unwrap(P.triple(word, P.ignore(wrapWSs(P.string(':'))), typePatter))

export const projectIdParser = P.typed(
  ProjectId,
  P.unwrap(
    P.unwrap(
      P.seq([
        P.ignore(projectIdKey),
        P.ignore(P.option(spaces)),
        P.ignore(P.string('=')),
        P.ignore(P.option(spaces)),
        projectIdPattern,
        P.ignore(P.option(spaces)),
        P.ignore(endOfLine),
      ])
    )
  )
)
export const infoParser = P.typed(
  Info,
  P.unwrap(
    P.seq([
      P.ignore(infoKey),
      P.ignore(spaces),
      P.stop([' ', '=']),
      P.option(P.ignore(P.many(space))),
      P.ignore(equal),
      P.ignore(P.many(space)),
      sentence,
    ])
  )
)
export const localeParser = P.typed(
  Locale,
  P.unwrap(
    P.unwrap(
      P.seq([P.ignore(localeKey), P.option(P.ignore(spaces)), P.ignore(equal), P.option(P.ignore(spaces)), word])
    )
  )
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
      word,
    ])
  )
)

export const valueTypeParser = P.typed(
  ValueType,
  P.unwrap(
    P.seq([
      name,
      P.ignore(P.option(spaces)),
      P.ignore(P.string(':')),
      P.ignore(P.option(spaces)),
      name,
      P.option(P.unwrap(P.double(P.ignore(P.string('@')), word))),
      P.ignore(P.option(spaces)),
      P.or([endOfLine, P.end()]),
    ])
  )
)

export const fakeParser = P.typed(Fake, P.unwrap(P.double(P.ignore(P.double(fakeKey, spaces)), word)))

export const generateParser = P.typed(
  Generate,
  P.unwrap(P.seq([P.ignore(generateKey), P.option(P.ignore(spaces)), dict()]))
)

export function createCollectionParser(document: IParser<any>) {
  return P.typed(
    CollectionType,
    P.unwrap(
      P.seq([
        P.ignore(collectionKey),
        P.ignore(spaces),
        name,
        P.ignore(P.option(spaces)),
        P.option(inCurlyBraces(P.many(document))),
      ])
    )
  )
}

export function createDocumentParser(collection: IParser<any>) {
  return P.typed(
    DocumentType,
    P.unwrap(
      P.unwrap(
        P.seq([
          P.ignore(documentKey),
          P.ignore(P.option(spaces)),
          P.option(
            inCurlyBraces(P.option(P.many(wrapWSs(P.or([valueTypeParser, fakeParser, generateParser, collection])))))
          ),
        ])
      )
    )
  )
}

export const collectionParser = createCollectionParser(
  createDocumentParser(
    createCollectionParser(
      createDocumentParser(
        createCollectionParser(
          createDocumentParser(
            createCollectionParser(
              createDocumentParser(
                createCollectionParser(
                  createDocumentParser(createCollectionParser(createDocumentParser(P.ignore(P.option(spaces)))))
                )
              )
            )
          )
        )
      )
    )
  )
)

export const schemaParser = P.typed(
  Schema,
  P.many(wrapWSs(P.or([infoParser, projectIdParser, constParser, localeParser, collectionParser, P.end()])))
)
