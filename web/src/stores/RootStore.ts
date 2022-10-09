import localforage from 'localforage'
import makeInspectable from 'mobx-devtools-mst'
import { types, Instance } from 'mobx-state-tree'
import { ListItemsStore, SnapshotInListItemsStore } from './ListItemsStore'
import persist from './mst-persist'

import { RecipeFormStore } from './RecipeFormStore'

export const RootStore = types
  .model({
    recipeFormStore: types.maybe(RecipeFormStore),
    listItemsStore: ListItemsStore,
  })

export const store = RootStore.create({
  listItemsStore: { items: {}}
})

makeInspectable(store)

persist('some', store, {
  storage: localforage,
  jsonify: false,
  whitelist: ['listItemsStore']  // only these keys will be persisted
}).then(() => console.log('store has been hydrated'))

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
