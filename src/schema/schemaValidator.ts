import { Schema } from './schema'
import { InvalidSchemaError } from './invalidSchemaError'

export class SchemaValidator {
  static validate(schema: Schema) {
    if (schema.projectId?.value == null) throw new InvalidSchemaError("Schema isn't contain projectId")
  }
}
