import { types } from 'mobx-state-tree'

export const RecipeFormStore = types
  .model('RecipeFormStore')
  .props({
    id: types.maybe(types.identifier), // only present when editing an existing form
    name: types.string,
  })
  .actions((self) => ({
    setName: (name: string) => {
      self.name = name
    },
  }))
