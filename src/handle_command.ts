import {
  makeStringFlag,
  makeCommand,
  reduceFlag,
  makeStringArgument,
  makePositionalArguments,
} from "catacli"

export function handleCommand(argv: string[]): void {
  const inputFlag = makeStringFlag("input", {
    alias: "i",
    usage: "Input scheme file path",
  })

  const outputFlag = makeStringFlag("output", {
    alias: "o",
    usage: "Output file path",
  })

  const exportArg = makeStringArgument("export")

  const flags = reduceFlag(inputFlag, outputFlag)
  const args = makePositionalArguments(exportArg)

  const command = makeCommand({
    name: "ptarmigan",
    description: "ptarmigan is Firestore schema utility",
    version: "0.1.0",
    usage: "ptarmigan argument [OPTIONS]",
    flag: flags,
    positionalArguments: args,
    handler: (args, flags) => {
      process.stdout.write(args.export.value)
      process.stdout.write(flags.input.value ?? "")
      process.stdout.write(flags.output.value ?? "")
    },
  })

  command(argv.splice(2))
}
