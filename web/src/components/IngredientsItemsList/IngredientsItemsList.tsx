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
    <ul>
      {items.map((item) => {
        const { quantity, unit, ingredientRef, id } = item!
        if (!listItemsStore.items.get(id)) {
          listItemsStore.addItem(id, itemsType)
        }
        return (
          <li
            key={`${quantity}-${unit.name}-${ingredientRef.name}`}
            className="ml-5 list-item"
          >
            - {quantity} {unit.name} {ingredientRef.name}
          </li>
        )
      })}
    </ul>
  )
}

export default observer(IngredientsItemsList)
