import { observable } from 'mobx'
import { types, Instance } from 'mobx-state-tree'
import { ListItemsStore, SnapshotInListItemsStore } from './ListItemsStore'

import { RecipeFormStore } from './RecipeFormStore'

export const RootStore = types
  .model({
    recipeFormStore: types.maybe(RecipeFormStore),
    listItemsStore: ListItemsStore,
  })

export const store = RootStore.create({
  listItemsStore: { items: {}}
})

const RootStoreContext = React.createContext<null | Instance<typeof store>>(
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
