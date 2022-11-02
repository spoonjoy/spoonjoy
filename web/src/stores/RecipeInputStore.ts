import { applySnapshot, Instance, SnapshotIn, types } from 'mobx-state-tree'
import { EditRecipeById } from 'types/graphql'

const IngredientInputStore = types
  .model('IngredientInputStore')
  .props({
    ingredientId: types.maybe(types.string),
    quantity: types.maybe(types.number),
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
export interface IIngredientInputStoreSnapshotIn
  extends SnapshotIn<typeof IngredientInputStore> {}
export interface IIngredientInputStore
  extends Instance<typeof IngredientInputStore> {}

const StepUseInputStore = types
  .model('StepUseInputStore')
  .props({
    outputOfStepNum: types.number,
  })
  .actions((self) => ({
    setOutputOfStepNum: (outputOfStepNum: number) => {
      self.outputOfStepNum = outputOfStepNum
    },
  }))
export interface IStepUseInputStoreSnapshotIn
  extends SnapshotIn<typeof StepUseInputStore> {}
export interface IStepUseInputStore
  extends Instance<typeof StepUseInputStore> {}

const RecipeStepInputStore = types
  .model('RecipeStepStore')
  .props({
    stepNum: types.number,
    description: types.string,
    ingredients: types.array(IngredientInputStore),
    stepOutputUses: types.array(StepUseInputStore),
  })
  .actions((self) => ({
    setStepNum: (stepNum: number) => {
      self.stepNum = stepNum
    },
    setDescription: (description: string) => {
      self.description = description
    },
    addIngredient: () => {
      self.ingredients.push({
        ingredientId: '',
        unitName: '',
        ingredientName: '',
      })
    },
    removeIngredient: () => {
      self.ingredients.pop()
    },
    setStepOutputUses: (stepOutputUses: IStepUseInputStoreSnapshotIn[]) => {
      applySnapshot(self.stepOutputUses, stepOutputUses)
    },
    addStepOutputUse: () => {
      self.stepOutputUses.push({
        outputOfStepNum: NaN,
      })
    },
    removeStepOutputUse: () => {
      self.stepOutputUses.pop()
    },
  }))
export interface IRecipeStepInputStoreSnapshotIn
  extends SnapshotIn<typeof RecipeStepInputStore> {}
export interface IRecipeStepInputStore
  extends Instance<typeof RecipeStepInputStore> {}

export const RecipeInputStore = types
  .model('RecipeInputStore')
  .props({
    id: types.maybe(types.string), // only present when editing an existing recipe
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
      self.steps.push({
        stepNum: newStepNum,
        description: '',
        // only init the ingredients on the first step, because otherwise they aren't required (because you can use stepOutputUses)
        ...(newStepNum === 1 && {
          ingredients: [
            IngredientInputStore.create({
              ingredientId: '',
              unitName: '',
              ingredientName: '',
            }),
          ],
        }),
      })
    },
    removeStep: () => {
      self.steps.pop()
    },
    clear: () => {
      console.log('clearing recipe input store!')
      applySnapshot(self, initRecipeInputStore)
    },
  }))
export interface IRecipeInputStoreSnapshotIn
  extends SnapshotIn<typeof RecipeInputStore> {}
export interface IRecipeInputStore extends Instance<typeof RecipeInputStore> {}
export const initRecipeInputStore: IRecipeInputStoreSnapshotIn = {
  title: '',
}

export const recipeQueryResponseToInputSnapshotIn = (
  recipe: EditRecipeById['recipe']
): IRecipeInputStoreSnapshotIn => {
  if (!recipe) {
    throw new Error('No recipe was passed in!')
  }
  const recipeSnapshotIn: IRecipeInputStoreSnapshotIn = {
    id: recipe.id,
    title: recipe.title,
    description: recipe.description || undefined,
    servings: recipe.servings || undefined,
    steps: recipe.steps.map((step): IRecipeStepInputStoreSnapshotIn => {
      if (!step) {
        throw new Error('The step seems to be missing!')
      }
      return {
        stepNum: step.stepNum,
        description: step.description || '',
        ingredients: step.ingredients.map(
          (ingredient): IIngredientInputStoreSnapshotIn => {
            if (!ingredient) {
              throw new Error('The ingredient seems to be missing!')
            }
            return {
              ingredientId: ingredient.id,
              quantity: ingredient.quantity,
              unitName: ingredient.unit.name,
              ingredientName: ingredient.ingredientRef.name,
            }
          }
        ),
        stepOutputUses: step.stepOutputUses.map(
          (stepOutputUse): IStepUseInputStoreSnapshotIn => {
            if (!stepOutputUse) {
              throw new Error('The ingredient seems to be missing!')
            }
            return {
              outputOfStepNum: stepOutputUse.outputOfStep.stepNum,
            }
          }
        ),
      }
    }),
  }
  return recipeSnapshotIn
}
