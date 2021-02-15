export abstract class Entity<T> {
  constructor(public readonly _: T) {
    Object.freeze(this)
  }

  toData() {
    return this._
  }
}
