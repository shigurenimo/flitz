import { Id } from "integrations/domain/valueObjects"
import { nanoid } from "nanoid"

export class IdFactory {
  static create() {
    return new Id(nanoid())
  }
}
