export function toStringOrNumber(text: string) {
  let num = NaN
  if (text.length > 0) {
    num = Number(text)
  }
  return isNaN(num) ? text : num
}
