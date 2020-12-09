import { makeStringFlag, makeCommand, reduceFlag, makeStringArgument, makePositionalArguments } from 'catacli'
import fs from 'fs'
import { CommandError } from './commandError'
import { GenerateAction } from './actions/generateAction'

export function handleCommand(argv: string[]): void {
  const configFlag = makeStringFlag('projectId', {
    alias: 'p',
    usage: 'set projectId'
  })

  const schemaArg = makeStringArgument('schema')

  const flags = reduceFlag(configFlag)
  const args = makePositionalArguments(schemaArg)

  const command = makeCommand({
    name: 'ptarmigan',
    description: 'ptarmigan is Firestore schema utility',
    version: '0.1.0',
    usage: 'ptarmigan schemafile [OPTIONS]',
    flag: flags,
    positionalArguments: args,
    handler: (args, flags) => {
      try {
        validateSchemaCommand(args.schema.value)
        new GenerateAction(args.schema.value, flags.projectId.value ?? null).execute().then(
          (_) => process.exit(0),
          (_) => process.exit(1)
        )
      } catch (e) {
        process.stderr.write(e.message)
      }
    }
  })

  command(argv.splice(2))
}

function validateSchemaCommand(schema: string) {
  if (schema == null) throw new CommandError('ArgumentError', 'schema is needed.')
  if (!fs.existsSync(schema)) throw new CommandError('ArgumentError', "schema doesn't exist.")
}
