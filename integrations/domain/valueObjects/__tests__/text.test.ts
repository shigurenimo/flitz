import faker from "faker"
import { PostText } from "integrations/domain/valueObjects"

describe("text", () => {
  it("minLength=1", () => {
    expect(() => new PostText("")).toThrowError()
  })

  it("maxLength=280", () => {
    const t = faker.lorem.paragraphs(2)
    expect(() => new PostText(t)).toThrowError()
  })
})
