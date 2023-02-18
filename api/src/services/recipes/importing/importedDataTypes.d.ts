export interface CroutonRecipe {
  name: string
  uuid: string
  serves: number
  // Preparation time in minutes
  duration: number
  // Cooking time in minutes
  cookingDuration: number
  // e.g. https://example.com
  webLink: string
  // The hostname of the computer that the recipe was exported from
  senderName: string
  ingredients: Array<{
    quantity: {
      quantityType:
        | 'ITEM'
        | 'TABLESPOON'
        | 'TEASPOON'
        | 'CUP'
        | 'MILLS'
        | 'GRAMS'
        | 'KGS'
        | 'POUND'
        | 'OUNCE'
        | 'LITRES'
        | 'DECILITER'
        | 'BOTTLE'
        | 'PINCH'
        | 'CAN'
        | 'BUNCH'
        | 'PACKET'
        | 'SECTION'
    }
    ingredient: {
      name: string
      uuid: string
    }
    order: number
    uuid: string
  }>
  steps: Array<{
    step: string
    order: number
    uuid: string
  }>
  notes: string
  folderIDs: unknown[]
  // base64-encoded PNG data
  images: string[]
}
