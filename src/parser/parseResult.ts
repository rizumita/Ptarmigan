export interface ParseResult<T> {
  next: string

  tryValue(): T
}

export class ParseSuccess<T> implements ParseResult<T> {
  value: T
  next: string

  constructor(value: T, next: string) {
    this.value = value
    this.next = next
  }

  tryValue(): T {
    return this.value
  }

  public toString(): string {
    return 'Success(' + this.value + ', ' + this.next + ')'
  }
}

export class ParseFailure<T> extends Error implements ParseResult<T> {
  next: string

  constructor(message: string, next: string) {
    super(message)
    this.next = next
  }

  tryValue(): T {
    throw this
  }

  public toString(): string {
    return 'Failure(' + this.message + ', ' + this.next + ')'
  }
}
