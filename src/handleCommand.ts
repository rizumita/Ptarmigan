import {
  makeStringFlag,
  makeCommand,
  reduceFlag,
  makeStringArgument,
  makePositionalArguments,
} from "catacli"
import fs from "fs"
import { ExportAction } from "./ExportAction"

export function handleCommand(argv: string[]): void {
  const outputFlag = makeStringFlag("output", {
    alias: "o",
    usage: "Output file path",
  })

  const schemaArg = makeStringArgument("schema")

  const flags = reduceFlag(outputFlag)
  const args = makePositionalArguments(schemaArg)

  const command = makeCommand({
    name: "ptarmigan",
    description: "ptarmigan is Firestore schema utility",
    version: "0.1.0",
    usage: "ptarmigan schemafile [OPTIONS]",
    flag: flags,
    positionalArguments: args,
    handler: (args, flags) => {
      try {
        validateSchemaCommand(args.schema.value, flags.output.value)
        new ExportAction(args.schema.value, flags.output.value ?? "").execute()
      } catch (e) {
        process.stderr.write(e.message)
      }
    },
  })

  command(argv.splice(2))
}

function validateSchemaCommand(schema: string, output: string | undefined) {
  if (schema == null)
    throw new CommandError("ArgumentError", "schema is needed.")
  if (!fs.existsSync(schema))
    throw new CommandError("ArgumentError", "schema doesn't exist.")
  if (output == undefined)
    throw new CommandError("OptionError", "output option is needed.")
}
