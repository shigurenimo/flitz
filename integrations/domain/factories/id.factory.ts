import { Id } from "integrations/domain/valueObjects"
import { customAlphabet, nanoid } from "nanoid"

export class IdFactory {
  static nanoid() {
    return new Id(nanoid())
  }

  static username() {
    const customNanoid = customAlphabet(
      "01234567890abcdefghijklmnopqrstuvwxyz",
      8
    )

    return new Id(customNanoid())
  }
}
