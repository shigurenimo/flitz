import { customAlphabet } from "nanoid"
import { Username } from "core/valueObjects"

export class UsernameFactory {
  static random() {
    const customNanoid = customAlphabet(
      "01234567890abcdefghijklmnopqrstuvwxyz",
      8
    )

    return new Username(customNanoid())
  }
}
