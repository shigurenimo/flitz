import { Count, Skip, Take } from "domain/valueObjects"

/**
 * ページング
 */
export class PageService {
  hasMore(input: { count: Count; skip: Skip; take: Take }) {
    return input.skip.value! + input.take.value! < input.count.value
  }

  nextPage(input: { take: Take; skip: Skip }) {
    return { take: input.take, skip: input.skip.value! + input.take.value! }
  }
}
