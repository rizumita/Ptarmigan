import { SchemaFile } from '../schemaFile'
import { schemaParser } from '../schemaParser/schemaParser'
import { ParseSuccess } from '../parser/parseResult'
import { Schema } from '../schema/schema'
import { Generator } from './generator'
import { ProjectId } from '../schema/projectId'
import { SchemaValidator } from '../schema/schemaValidator'

export class GenerateAction {
  constructor(schema: string, projectId: string | null) {
    this.schemaFile = new SchemaFile(schema)
    this.projectId = projectId != null ? new ProjectId(projectId) : null
  }

  schemaFile: SchemaFile
  projectId: ProjectId | null

  public async execute() {
    try {
      const schema = parseSchema(this.schemaFile.text)
      SchemaValidator.validate(schema)
      await new Generator(schema).generate()
    } catch (e) {
      process.stderr.write(e.toString())
    }
  }
}

export function parseSchema(schemaText: string) {
  const result = schemaParser.parse(schemaText)

  if (result instanceof ParseSuccess) {
    return result.value as Schema
  } else {
    throw result
  }
}
