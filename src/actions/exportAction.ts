import { SchemaFile } from '../schemaFile'
import { schemaParser } from '../schemaParser/schemaParser'
import { ParseSuccess } from '../parser/parseResult'
import { Schema } from '../schema/schema'

export class ExportAction {
  constructor(schema: string, output: string) {
    this.schemaFile = new SchemaFile(schema)
    this.output = output
  }

  schemaFile: SchemaFile
  output: string

  public execute(): void {
    try {
      const schema = parseSchema(this.schemaFile.text)
    } catch (e) {
      process.stderr.write(e.toString())
    }
  }
}

export function parseSchema(pt: string) {
  const schemaFile = new SchemaFile(pt)
  const result = schemaParser.parse(schemaFile.text)

  if (result instanceof ParseSuccess) {
    return result.value as Schema
  } else {
    throw result
  }
}
