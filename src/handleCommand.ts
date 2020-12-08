import { makeStringFlag, makeCommand, reduceFlag, makeStringArgument, makePositionalArguments } from 'catacli'
import fs from 'fs'
import { CommandError } from './commandError'
import { GenerateAction } from './actions/generateAction'

export function handleCommand(argv: string[]): void {
  const configFlag = makeStringFlag('config', {
    alias: 'c',
    usage: 'config file path'
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
        validateSchemaCommand(args.schema.value, flags.config.value)
        new GenerateAction(args.schema.value, flags.config.value ?? '').execute()
      } catch (e) {
        process.stderr.write(e.message)
      }
    }
  })

  command(argv.splice(2))
}

function validateSchemaCommand(schema: string, output: string | undefined) {
  if (schema == null) throw new CommandError('ArgumentError', 'schema is needed.')
  if (!fs.existsSync(schema)) throw new CommandError('ArgumentError', "schema doesn't exist.")
  if (output == undefined) throw new CommandError('OptionError', 'output option is needed.')
}
