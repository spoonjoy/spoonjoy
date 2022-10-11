import { types } from 'mobx-state-tree'

const IngredientInputStore = types
  .model('IngredientInputStore')
  .props({
    ingredientId: types.maybe(types.identifier),
    quantity: types.number,
    unitName: types.string,
    ingredientName: types.string,
  })
  .actions((self) => ({
    setIngredientId: (ingredientId: string | undefined) => {
      self.ingredientId = ingredientId
    },
    setQuantity: (quantity: number) => {
      self.quantity = quantity
    },
    setUnitName: (unitName: string) => {
      self.unitName = unitName
    },
    setIngredientName: (ingredientName: string) => {
      self.ingredientName = ingredientName
    },
  }))

const RecipeStepInputStore = types
  .model('RecipeStepStore')
  .props({
    stepNum: types.number,
    description: types.string,
    ingredients: types.array(IngredientInputStore),
  })
  .actions((self) => ({
    setStepNum: (stepNum: number) => {
      self.stepNum = stepNum
    },
    setDescription: (description: string) => {
      self.description = description
    },
  }))

export const RecipeInputStore = types
  .model('RecipeInputStore')
  .props({
    id: types.maybe(types.identifier), // only present when editing an existing recipe
    title: types.string,
    description: types.maybe(types.string),
    servings: types.maybe(types.number),
    steps: types.array(RecipeStepInputStore),
  })
  .actions((self) => ({
    setTitle: (title: string) => {
      self.title = title
    },
    setDescription: (description: string | undefined) => {
      self.description = description
    },
    setServings: (servings: number | undefined) => {
      self.servings = servings
    },
    addStep: () => {
      const newStepNum = self.steps.length + 1
      self.steps.push({stepNum: newStepNum, description: ""})
    }
  }))
