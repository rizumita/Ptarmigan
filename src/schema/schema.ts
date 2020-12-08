import { TypedValue } from '../parser/typedParser'
import { Info } from './info'
import { Constant } from './constant'
import { Locale } from './locale'
import { ValueType } from './valueType'
import { ComplexType } from './complexType'
import { CollectionType } from './CollectionType'

export class Schema implements TypedValue {
  infos: Info[]
  constants: Constant[]
  locale: Locale
  valueTypes: ValueType[]
  complexTypes: ComplexType[]
  collections: CollectionType[]

  constructor(value: any[]) {
    this.infos = value.filter((v) => v instanceof Info)
    this.constants = value.filter((v) => v instanceof Constant)
    this.locale = value.find((v) => v instanceof Locale) ?? new Locale(['locale', 'en'])
    this.valueTypes = value.filter((v) => v instanceof ValueType)
    this.complexTypes = value.filter((v) => v instanceof ComplexType)
    this.collections = value.filter((v) => v instanceof CollectionType)
  }
}
