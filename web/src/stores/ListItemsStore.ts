import { SnapshotIn, types } from 'mobx-state-tree'

export enum ListItemType {
  Ingredient = 'Ingredient',
  ShoppingListItem = 'ShoppingListItem',
}

const ListItemStore = types
  .model('ListItemStore')
  .props({
    id: types.maybe(types.string),
    itemType: types.enumeration<ListItemType>(Object.values(ListItemType)),
    selected: types.optional(types.boolean, false),
  })
  .actions((self) => ({
    setItemState: (selected: boolean) => {
      self.selected = selected
    },
  }))

/**
 * This simply stores items IDs (either shopping list items or recipe step ingredients) and their selection state
 */
export const ListItemsStore = types
  .model('ListItemsStore')
  .props({
    items: types.map(ListItemStore),
  })
  .actions((self) => ({
    clearState: () => {
      self.items.clear()
    },
    addItem: (id: string, itemType: ListItemType) => {
      self.items.put({ id, itemType })
    },
    resetItemStates: (itemIds: string[]) => {
      itemIds.forEach((id) => {
        self.items.get(id)?.setItemState(false)
      })
    },
  }))

export interface SnapshotInListItemsStore
  extends SnapshotIn<typeof ListItemsStore> {}
