import { nanoid } from "nanoid"
import { Id } from "core/valueObjects"

export class IdFactory {
  /**
   * nanoid
   * https://www.npmjs.com/package/nanoid
   * @returns
   */
  static nanoid() {
    return new Id(nanoid())
  }

  /**
   * Firebase向けのID
   * @returns
   */
  static autoId() {
    const seed =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

    let text = ""

    for (var i = 0; i < seed.length; i++) {
      text += seed[Math.floor(Math.random() * seed.length)]
    }

    return new Id(text)
  }
}
