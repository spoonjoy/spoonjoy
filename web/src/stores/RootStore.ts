import { types, Instance } from 'mobx-state-tree'

import { RecipeFormStore, RecipeFormStoreInitState } from './RecipeFormStore'

export const RootStore = types
  .model({
    recipeFormStore: RecipeFormStore,
  })
  .create({
    recipeFormStore: RecipeFormStoreInitState,
  })

const RootStoreContext = React.createContext<null | Instance<typeof RootStore>>(
  null
)
export const StoreProvider = RootStoreContext.Provider

export function useStore() {
  const store = React.useContext(RootStoreContext)
  if (store === null) {
    throw new Error('Store cannot be null, please add a context provider')
  }
  return store
}
