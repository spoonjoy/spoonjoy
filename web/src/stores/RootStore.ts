import { types, Instance } from 'mobx-state-tree'
import { ListItemsStore } from './ListItemsStore'

import { RecipeFormStore } from './RecipeFormStore'

export const RootStore = types
  .model({
    recipeFormStore: RecipeFormStore,
    listItemsStore: ListItemsStore
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
