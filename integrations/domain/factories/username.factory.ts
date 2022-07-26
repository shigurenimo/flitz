import { customAlphabet } from "nanoid"
import { Username } from "integrations/domain/valueObjects"

export class UsernameFactory {
  static random() {
    const customNanoid = customAlphabet(
      "01234567890abcdefghijklmnopqrstuvwxyz",
      8
    )

    return new Username(customNanoid())
  }
}
