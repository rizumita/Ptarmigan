import * as P from '../parser/parser'
import { IParser } from '../parser/iParser'
import { TypedValue } from '../parser/typedParser'
import { wrapWSs } from '../parser/utilityParsers'
import { Info } from './info'
import { Constant } from './constant'
import { Locale } from './locale'
import { Collection } from './collection'
import { ProjectId } from './projectId'
import { InvalidSchemaError } from './invalidSchemaError'

export class Schema implements TypedValue {
  infos: Info[]
  projectId: ProjectId | null
  constants: Constant[]
  locale: Locale
  collections: Collection[]

  constructor(value: (Info | ProjectId | Constant | Locale | Collection)[]) {
    this.infos = value.filter((v): v is Info => v instanceof Info)
    this.projectId = value.find((v): v is ProjectId => v instanceof ProjectId) ?? null
    this.constants = value.filter((v): v is Constant => v instanceof Constant)
    this.locale = value.find((v): v is Locale => v instanceof Locale) ?? new Locale('en')
    this.collections = value.filter((v): v is Collection => v instanceof Collection)
  }

  getConstant(value: string) {
    const result = this.constants.find(v => v.key == value)?.value

    if (result == null || result == '') {
      throw new InvalidSchemaError(value + "isn't exist in constants.")
    }

    return result
  }

  static get parser(): IParser<Schema> {
    const content = P.or<Info | ProjectId | Constant | Locale | Collection>([
      Info.parser,
      ProjectId.parser,
      Constant.parser,
      Locale.parser,
      Collection.parser(7),
    ])
    const contents = P.many(wrapWSs(content))
    return P.map(P.double(contents, P.end()), v => new Schema(v[0]))
  }
}
