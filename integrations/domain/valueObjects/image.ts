/**
 * イメージ
 */
export class Image {
  constructor(public value: Buffer) {
    Object.freeze(this)
  }
}
