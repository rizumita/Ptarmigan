import fs from 'fs'

export class SchemaFile {
  path: string
  text: string

  constructor(schemaFile: string) {
    this.path = schemaFile
    this.text = fs.readFileSync(schemaFile, 'utf8')
  }
}
