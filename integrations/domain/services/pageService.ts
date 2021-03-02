import { Count, Skip, Take } from "integrations/domain/valueObjects"

/**
 * ページング
 */
export class PageService {
  hasMore(take: Take, skip: Skip, count: Count) {
    return skip.value! + take.value! < count.value
  }

  nextPage(take: Take, skip: Skip) {
    return { take: take, skip: skip.value! + take.value! }
  }
}
