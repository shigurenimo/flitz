import { Id } from "integrations/domain/valueObjects"
import { customAlphabet, nanoid } from "nanoid"

export class IdFactory {
  static create() {
    return new Id(nanoid())
  }

  static createUsername() {
    const customNanoid = customAlphabet(
      "01234567890abcdefghijklmnopqrstuvwxyz",
      8
    )

    return new Id(customNanoid())
  }
}
