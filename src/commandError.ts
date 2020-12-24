export class CommandError extends Error {
  message: string

  constructor(name: string, message: string) {
    super(name)
    this.message = message
  }
}
