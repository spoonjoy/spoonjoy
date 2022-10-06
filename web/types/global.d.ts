export {}

declare global {
  /**
   * To use instead of Partial when nested objects are concerned
   */
  type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>
  }

  /**
   * For extracting the type from a larger object, eg arrays
   * https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#type-inference-in-conditional-types
   */
  type Unpacked<T> = T extends (infer U)[]
    ? U
    : T extends (...args: any[]) => infer U
    ? U
    : T extends Promise<infer U>
    ? U
    : T
}
