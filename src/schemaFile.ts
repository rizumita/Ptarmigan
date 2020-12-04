import fs from 'fs'

export class SchemaFile {
  text: string

  constructor(schemaFile: string) {
    this.text = fs.readFileSync(schemaFile, 'utf8')
  }
}
