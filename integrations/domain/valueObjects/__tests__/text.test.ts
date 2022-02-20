import { PostText } from "integrations/domain/valueObjects"

describe("text", () => {
  it("minLength=1", () => {
    expect(() => new PostText("")).toThrowError()
  })
})
