import { stdout } from 'process'
import { SchemaFile } from './schemaFile'

export class ExportAction {
  constructor(schema: string, output: string) {
    this.schemaFile = new SchemaFile(schema)
    this.output = output
  }

  schemaFile: SchemaFile
  output: string

  public execute(): void {}
}
