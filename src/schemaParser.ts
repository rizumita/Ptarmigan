import * as P from './parser/parser'
import { string } from './parser/parser'

const spaceParser = P.string(' ')
const whitespaceParser = P.many(P.or([spaceParser, P.string('\t'), P.string('\n')]))
const keyParser = P.stop([':'])
const keyValueSeparatorParser = P.ignore(P.many(P.or([P.string(':'), spaceParser])))
const valueParser = P.stop(['\n'])
export const itemParser = P.triple(keyParser, keyValueSeparatorParser, valueParser)
