import { BeakerIcon } from '@heroicons/react/20/solid'
import { Square2StackIcon } from '@heroicons/react/20/solid'
import { observer } from 'mobx-react-lite'

import { useStore } from 'src/stores/RootStore'

// Ingredient items and shopping list items are the same, but shopping list items should have quantity and unit optional. That's a TODO
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

interface IShoppingListItem {
  id: string
  quantity?: number
  unit?: {
    name: string
  }
  ingredientRef: {
    name: string
  }
}

interface IStepOutputUseItem {
  id: string
  outputOfStep: {
    stepNum: number
  }
}

/** This technically has more things but this is all we want it for here */
interface IStepItem {
  stepNum: number
  stepTitle: string | null | undefined
}

/** For casting on input */
export type IStepInfoForList = IStepItem[]

interface IIngredientsItemsList {
  items: (IIngredientItem | IStepOutputUseItem | null)[]
  /** This is used by stepOutputUses to get the step titles */
  steps?: IStepInfoForList
  listType: 'recipeIngredients' | 'shoppingListItems' | 'stepOutputUses'
}

// For use both when listing ingredients in a recipe and items in a shopping list
const IngredientsItemsList = ({
  items,
  steps,
  listType,
}: IIngredientsItemsList) => {
  const { listItemsStore } = useStore()
  const getStepTitle = (stepNum: number) => {
    return steps && steps[stepNum - 1].stepTitle
  }
  return (
    <fieldset className="border-t border-b border-gray-200">
      <ul className="divide-y divide-gray-200 ">
        {items.map((item) => {
          const { id } = item!
          if (listItemsStore.items.get(id) === undefined) {
            listItemsStore.addItem(id)
          }
          const itemStore = listItemsStore.items.get(id)!
          const selected = itemStore.selected
          const onCheck = () => {
            itemStore.setItemState(!selected)
          }

          const itemInfo = (() => {
            switch (listType) {
              case 'recipeIngredients':
                return getIngredientItemInfo(item as IIngredientItem)
              case 'stepOutputUses':
                return getStepOutputUseItemInfo(
                  item as IStepOutputUseItem,
                  getStepTitle
                )
              case 'shoppingListItems':
                return getShoppingListItemInfo(item as IShoppingListItem)
            }
          })()

          const iconProps = {
            className: 'mr-3 h-5 w-5 text-indigo-600',
            'aria-hidden': true,
          }

          const itemIcon = (() => {
            switch (listType) {
              case 'recipeIngredients':
                return <BeakerIcon {...iconProps} />
              case 'stepOutputUses':
                return <Square2StackIcon {...iconProps} />
            }
          })()

          return (
            <li key={itemInfo.key}>
              <button className="relative h-full w-full py-4" onClick={onCheck}>
                {/* For crossing out and greying selected items */}
                <span
                  className={`absolute ${
                    itemIcon ? 'left-[1.8rem]' : 'left-0'
                  } bottom-0 z-10 flex h-full ${
                    itemIcon ? 'w-[calc(100%-3.5rem)]' : 'w-[calc(100%-1.7rem)]'
                  } flex-col ${selected ? 'block' : 'hidden'}`}
                >
                  <span className="border-b-[1px]f absolute top-0 left-0 right-0 h-1/2 w-full border-gray-500 bg-white bg-opacity-50" />
                  <span className="absolute bottom-0 left-0 right-0 h-1/2 w-full border-t-[1px] border-gray-500 bg-white bg-opacity-50" />
                </span>
                <span className="z-0 flex h-full w-full items-start">
                  {itemIcon}
                  <div className="min-w-0 flex-1 text-start text-sm">
                    {itemInfo.itemLabel}
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
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </fieldset>
  )
}

const getIngredientItemInfo = (item: IIngredientItem) => {
  const { quantity, unit, ingredientRef, id } = item
  return {
    key: `${quantity}-${unit.name}-${ingredientRef.name}`,
    itemLabel: (
      <span
        id={`ingredient-${id}-label`}
        className="flex select-none justify-between text-gray-700"
      >
        <span className="font-medium">{ingredientRef.name}</span>
        <span className="font-normal">
          {' '}
          {quantity} {unit.name}{' '}
        </span>
      </span>
    ),
  }
}

const getShoppingListItemInfo = (item: IShoppingListItem) => {
  const { quantity, unit, ingredientRef, id } = item
  return {
    key: `${ingredientRef.name}`,
    itemLabel: (
      <span
        id={`ingredient-${id}-label`}
        className="flex select-none justify-between text-gray-700"
      >
        <span className="font-medium">{ingredientRef.name}</span>
        {quantity && unit && (
          <span className="font-normal">
            {' '}
            {quantity} {unit.name}{' '}
          </span>
        )}
      </span>
    ),
  }
}

const getStepOutputUseItemInfo = (
  item: IStepOutputUseItem,
  getStepTitle: (stepNum: number) => string | null | undefined
) => {
  const { id, outputOfStep } = item
  const { stepNum } = outputOfStep
  const stepTitle = getStepTitle(stepNum)
  return {
    key: `stepoutputusage-${stepNum}-${id}`,
    itemLabel: (
      <span
        id={`stepoutputusage-${id}-label`}
        className="select-none text-gray-700"
      >
        <span className="font-normal">output of </span>
        <span className="font-medium">step {stepNum}</span>
        {stepTitle && <span className="font-medium">: {stepTitle}</span>}
      </span>
    ),
  }
}

export default observer(IngredientsItemsList)
