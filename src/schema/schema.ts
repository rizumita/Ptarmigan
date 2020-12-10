import { TypedValue } from '../parser/typedParser'
import { Info } from './info'
import { Constant } from './constant'
import { Locale } from './locale'
import { ValueType } from './valueType'
import { ComplexType } from './complexType'
import { CollectionType } from './collectionType'
import { ProjectId } from './projectId'
import { InvalidSchemaError } from './invalidSchemaError'

export class Schema implements TypedValue {
  infos: Info[]
  projectId: ProjectId | null
  constants: Constant[]
  locale: Locale
  valueTypes: ValueType[]
  complexTypes: ComplexType[]
  collections: CollectionType[]

  constructor(value: any[]) {
    this.infos = value.filter((v) => v instanceof Info)
    this.projectId = value.find((v) => v instanceof ProjectId)
    this.constants = value.filter((v) => v instanceof Constant)
    this.locale = value.find((v) => v instanceof Locale) ?? new Locale('en')
    this.valueTypes = value.filter((v) => v instanceof ValueType)
    this.complexTypes = value.filter((v) => v instanceof ComplexType)
    this.collections = value.filter((v) => v instanceof CollectionType)
  }

  getConstant(value: string) {
    const result = this.constants.find((v) => v.key == value)?.value

    if (result == null) {
      throw new InvalidSchemaError(value + "isn't exist in constants.")
    }

    return result
  }
}
