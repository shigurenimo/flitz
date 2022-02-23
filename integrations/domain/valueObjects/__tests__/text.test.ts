import { PostText } from "integrations/domain"

describe("text", () => {
  it("minLength=1", () => {
    expect(() => new PostText("")).toThrowError()
  })
})
