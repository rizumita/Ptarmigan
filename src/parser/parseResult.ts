export interface ParseResult<T> {}

export class ParseSuccess<T> implements ParseResult<T> {
  value: T
  next: string

  constructor(value: T, next: string) {
    this.value = value
    this.next = next
  }

  public toString(): string {
    return 'Success(' + this.value + ', ' + this.next + ')'
  }
}

export class ParseIgnored<T> implements ParseResult<T> {
  value: T | null = null
  next: string

  constructor(next: string) {
    this.next = next
  }
}

export class ParseFailure<T> implements ParseResult<T> {
  message: string
  next: string

  constructor(message: string, next: string) {
    this.message = message
    this.next = next
  }

  public toString(): string {
    return 'Failure(' + this.message + ', ' + this.next + ')'
  }
}
