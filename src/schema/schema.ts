import assert from 'assert'
import { instanceId } from 'firebase-admin/lib/instance-id'
import * as P from '../parser/parser'
import { IParser } from '../parser/iParser'
import { TypedValue } from '../parser/typedParser'
import { inWhitespaces } from '../parser/utilityParsers'
import { Comment } from './comment'
import { Depend } from './depend'
import { DocumentType } from './documentType'
import { Info } from './info'
import { Constant } from './constant'
import { Locale } from './locale'
import { Collection } from './collection'
import { ProjectId } from './projectId'
import { InvalidSchemaError } from './invalidSchemaError'

export class Schema implements TypedValue {
  infos: Info[]
  depends: Depend[]
  projectId: ProjectId | null
  constants: Constant[]
  locale: Locale | null
  documentTypes: DocumentType[]
  collections: Collection[]

  constructor(value: ContentType[]) {
    this.infos = value.filter((v): v is Info => v instanceof Info)
    this.depends = value.filter((v): v is Depend => v instanceof Depend)
    this.projectId = value.find((v): v is ProjectId => v instanceof ProjectId) ?? null
    this.constants = value.filter((v): v is Constant => v instanceof Constant)
    this.locale = value.find((v): v is Locale => v instanceof Locale) ?? null
    this.documentTypes = value.filter((v): v is DocumentType => v instanceof DocumentType)
    this.collections = value.filter((v): v is Collection => v instanceof Collection)
  }

  append(schema: Schema): void {
    this.infos.push(...schema.infos)
    this.projectId = schema.projectId != null ? schema.projectId : this.projectId
    this.constants.push(...schema.constants)
    this.locale = schema.locale != null ? schema.locale : this.locale
    this.documentTypes.push(...schema.documentTypes)
    this.collections = schema.collections.concat(this.collections)
  }

  getConstant(value: string): string | number {
    const result = this.constants.find(v => v.key == value)?.value

    if (result == null || result == '') {
      throw new InvalidSchemaError(value + "isn't exist in constants.")
    }

    return result
  }

  static get parser(): IParser<Schema> {
    const content = P.or<ContentType>([
      Info.parser,
      Depend.parser,
      ProjectId.parser,
      Constant.parser,
      Locale.parser,
      DocumentType.parser,
      Collection.parser(7),
    ])
    const contents = P.many(
      P.or<ContentType>([inWhitespaces(content), Comment.parser])
    )
    return P.map(P.double(contents, P.end()), v => new Schema(v[0]))
  }
}

type ContentType = Info | Depend | ProjectId | Constant | Locale | DocumentType | Collection | Comment
