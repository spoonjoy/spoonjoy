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
}

// For use both when listing ingredients in a recipe and items in a shopping list
const IngredientsItemsList = ({ items }: IIngredientsItemsList) => {
  return (
    <ul>
      {items.map((item) => {
        const { quantity, unit, ingredientRef } = item!
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

export default IngredientsItemsList
