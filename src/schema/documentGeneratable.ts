import { Field } from './field/field'

export interface DocumentGeneratable {
  length: number

  docs(fields: Field[]): { [key: string]: unknown }[]
}
