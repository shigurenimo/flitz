/**
 * イメージ
 */
export class Image {
  readonly key = "IMAGE"

  constructor(public value: Buffer) {
    Object.freeze(this)
  }
}
