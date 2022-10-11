import localforage from 'localforage'
import makeInspectable from 'mobx-devtools-mst'
import { types, Instance } from 'mobx-state-tree'
import { ListItemsStore, SnapshotInListItemsStore } from './ListItemsStore'
import persist from './mst-persist'

import { RecipeInputStore } from './RecipeInputStore'

export const RootStore = types.model({
  recipeInputStore: RecipeInputStore,
  listItemsStore: ListItemsStore,
})

export const store = RootStore.create({
  recipeInputStore: { id: "", title: ""},
  listItemsStore: { items: {} },
})

makeInspectable(store)

persist('rootstore', store, {
  storage: localforage,
  jsonify: false,
  whitelist: ['listItemsStore', 'recipeInputStore'], // only these keys will be persisted
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
