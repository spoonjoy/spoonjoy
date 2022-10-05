export {}

declare global {
  /**
   * To use instead of Partial when nested objects are concerned
   */
  type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>
  }
}
