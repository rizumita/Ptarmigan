import { ParseSuccess } from '../parser/parseResult'
import { Comment } from './comment'

describe('Comment', () => {
  test.each([
    ['//comment', 'comment'],
    ['// comment', 'comment'],
  ])('parse', (input, text) =>
    expect(Comment.parser.parse(input)).toStrictEqual(new ParseSuccess(new Comment(text), ''))
  )
})
