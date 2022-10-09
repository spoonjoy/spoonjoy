import { useStore } from 'src/stores/RootStore'
import { ListItemType } from 'src/stores/ListItemsStore'
import { observer } from 'mobx-react-lite'

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
    <fieldset>
      <ul className="mt-4 divide-y divide-gray-200 border-t border-b border-gray-200 max-w-xs">
        {items.map((item) => {
          const { quantity, unit, ingredientRef, id } = item!
          if (!listItemsStore.items.get(id)) {
            listItemsStore.addItem(id, itemsType)
          }
          return (
            <li
              key={`${quantity}-${unit.name}-${ingredientRef.name}`}
              className="relative flex items-start py-4"
            >
              <div className="min-w-0 flex-1 text-sm">
                <label
                  htmlFor={`ingredient-${id}`}
                  className="select-none font-medium text-gray-700"
                >
                  {quantity} {unit.name} {ingredientRef.name}
                </label>
              </div>
              <div className="ml-3 flex h-5 items-center">
                <input
                  id={`ingredient-${id}`}
                  name={`ingredient-${id}`}
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
            </li>
          )
        })}
      </ul>
    </fieldset>
  )
}

export default observer(IngredientsItemsList)
