import { Count, Skip, Take } from "app/domain/valueObjects"

/**
 * ## ページング
 */
export class PageService {
  static hasMore(input: { count: Count; skip: Skip; take: Take }) {
    return input.skip.value! + input.take.value! < input.count.value
  }

  static nextPage(input: { take: Take; skip: Skip }) {
    return { take: input.take, skip: input.skip.value! + input.take.value! }
  }
}
