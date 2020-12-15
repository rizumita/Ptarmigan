import { Document } from './document'
import { Schema } from './schema'

export interface DocumentGeneratable {
  length: number

  docs(document: Document, schema: Schema): { [key: string]: unknown }[]
}
