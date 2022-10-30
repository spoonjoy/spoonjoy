import { SnapshotIn, types } from 'mobx-state-tree'

const ListItemStore = types
  .model('ListItemStore')
  .props({
    id: types.identifier,
    selected: types.optional(types.boolean, false),
  })
  .actions((self) => ({
    setItemState: (selected: boolean) => {
      self.selected = selected
    },
  }))

/**
 * This simply stores items IDs (either shopping list items or recipe step ingredients or recipe step output uses) and their selection state
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
    addItem: (id: string) => {
      self.items.put({ id })
    },
    resetItemStates: (itemIds: string[]) => {
      itemIds.forEach((id) => {
        self.items.get(id)?.setItemState(false)
      })
    },
  }))

export interface SnapshotInListItemsStore
  extends SnapshotIn<typeof ListItemsStore> {}
