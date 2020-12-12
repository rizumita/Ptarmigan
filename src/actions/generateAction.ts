import { SchemaFile } from '../schemaFile'
import { Schema } from '../schema/schema'
import { Generator } from './generator'
import { ProjectId } from '../schema/projectId'
import { SchemaValidator } from '../schema/schemaValidator'

export class GenerateAction {
  constructor(schemaFilePath: string, projectId: string | null) {
    this.schemaFile = new SchemaFile(schemaFilePath)
    this.projectId = projectId != null ? new ProjectId(projectId) : null
  }

  schemaFile: SchemaFile
  projectId: ProjectId | null

  public async execute(): Promise<void> {
    try {
      const schema = Schema.parser.parse(this.schemaFile.text).tryValue()
      if (schema.projectId == null) schema.projectId = this.projectId
      SchemaValidator.validate(schema)
      await new Generator(schema).generate()
    } catch (e) {
      process.stderr.write(e.toString())
    }
  }
}
