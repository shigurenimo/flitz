import { PostText } from "domain/valueObjects/postText"
import faker from "faker"

describe("text", () => {
  it("minLength=1", () => {
    expect(() => new PostText("")).toThrowError()
  })

  it("maxLength=280", () => {
    const t = faker.lorem.paragraphs(2)
    expect(() => new PostText(t)).toThrowError()
  })
})
