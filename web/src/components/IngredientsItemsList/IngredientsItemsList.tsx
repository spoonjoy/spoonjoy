import { observer } from 'mobx-react-lite'

import { ListItemType } from 'src/stores/ListItemsStore'
import { useStore } from 'src/stores/RootStore'

interface IIngredientItem {
  id: string
  quantity: number
  unit: {
    name: string
  }
  ingredientRef: {
    name: string
  }
}

interface IIngredientsItemsList {
  items: (IIngredientItem | null)[]
  itemsType: ListItemType
}

// For use both when listing ingredients in a recipe and items in a shopping list
const IngredientsItemsList = ({ items, itemsType }: IIngredientsItemsList) => {
  const { listItemsStore } = useStore()
  return (
    <fieldset className="border-t border-b border-gray-200">
      <ul className="divide-y divide-gray-200 ">
        {items.map((item) => {
          const { quantity, unit, ingredientRef, id } = item!
          if (listItemsStore.items.get(id) === undefined) {
            listItemsStore.addItem(id, itemsType)
          }
          const itemStore = listItemsStore.items.get(id)!
          const selected = itemStore.selected
          const onCheck = () => {
            itemStore.setItemState(!selected)
          }
          return (
            <li key={`${quantity}-${unit.name}-${ingredientRef.name}`}>
              <button
                className="relative flex h-full w-full items-start py-4"
                onClick={onCheck}
              >
                <div className="min-w-0 flex-1 text-start text-sm">
                  <span
                    id={`ingredient-${id}-label`}
                    className={`select-none font-medium  ${
                      selected ? 'text-gray-400 line-through' : 'text-gray-700'
                    }`}
                  >
                    {quantity} {unit.name} {ingredientRef.name}
                  </span>
                </div>
                <div className="ml-3 flex h-5 items-center">
                  <input
                    id={`ingredient-${id}`}
                    name={`ingredient-${id}`}
                    type="checkbox"
                    checked={selected}
                    onChange={onCheck}
                    className="h-4 w-4 cursor-pointer rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </div>
              </button>
            </li>
          )
        })}
      </ul>
    </fieldset>
  )
}

export default observer(IngredientsItemsList)
