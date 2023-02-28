export interface CroutonRecipe {
  name: string
  uuid: string
  // base64-encoded data
  sourceImage?: string
  defaultScale: number
  serves?: number
  // Preparation time in minutes
  duration?: number
  // Cooking time in minutes
  cookingDuration?: number
  // e.g. https://example.com
  webLink?: string
  // The hostname of the computer that the recipe was exported from
  senderName: string
  ingredients: Array<{
    quantity?: {
      // the below list might not be exhaustive, so we use a string
      quantityType?: string
      // quantityType:
      //   | 'ITEM'
      //   | 'TABLESPOON'
      //   | 'TEASPOON'
      //   | 'CUP'
      //   | 'MILLS'
      //   | 'GRAMS'
      //   | 'KGS'
      //   | 'POUND'
      //   | 'OUNCE'
      //   | 'LITRES'
      //   | 'DECILITER'
      //   | 'BOTTLE'
      //   | 'PINCH'
      //   | 'CAN'
      //   | 'BUNCH'
      //   | 'PACKET'
      //   | 'SECTION'
      amount?: number
    }
    ingredient?: {
      name: string
      uuid: string
    }
    order: number
    uuid: string
  }>
  steps: Array<{
    step: string
    order: number
    isSection: boolean
    uuid: string
  }>
  notes?: string
  folderIDs: unknown[]
  // base64-encoded PNG data
  images: string[]
  tags: string[]
}
