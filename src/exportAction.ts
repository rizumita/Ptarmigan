import { stdout } from "process"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class ExportAction {
  constructor(schema: string, output: string) {
    this.schema = schema
    this.output = output
  }

  schema: string
  output: string

  public execute(): void {
    stdout.write(this.schema)
  }
}
