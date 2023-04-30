import { DraggableAttributes } from '@dnd-kit/core'
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'
import { BeakerIcon } from '@heroicons/react/20/solid'
import { Square2StackIcon } from '@heroicons/react/20/solid'
import { Bars3Icon, MinusCircleIcon } from '@heroicons/react/24/outline'
import { PencilIcon } from '@heroicons/react/24/solid'
import { observer } from 'mobx-react-lite'

import { classNames } from 'src/helpers/css'
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

type ListType = 'recipeIngredients' | 'shoppingListItems' | 'stepOutputUses'

interface IIngredientsItemsList {
  items?: (IIngredientItem | IStepOutputUseItem | null)[]
  /** This is used by stepOutputUses to get the step titles */
  steps?: IStepInfoForList
  listType?: ListType
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
    <fieldset>
      <ul>
        {items && listType ? (
          items.map((item) => {
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

            return (
              <ListItem
                listType={listType}
                key={itemInfo.key}
                uniqueId={id}
                itemInfo={itemInfo}
                selected={selected}
                onCheck={onCheck}
                checkable
              />
            )
          })
        ) : (
          <>
            <li className="loading h-full w-full py-4" />
            <li className="loading h-full w-full py-4" />
            <li className="loading h-full w-full py-4" />
          </>
        )}
      </ul>
    </fieldset>
  )
}

interface IDeletableListItemConfig {
  isDeletable: boolean
  onClickDelete: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

interface IDraggableListItemConfig {
  isDraggable: boolean
  listeners: SyntheticListenerMap | undefined
  attributes: DraggableAttributes
  style: React.CSSProperties | undefined
}

interface IEditableListItemConfig {
  isEditable: boolean
  editInterface: JSX.Element
}

interface IListItemProps {
  /** Used to provide info about how the item should be rendered, eg what icon to use.  */
  listType: ListType
  /** Used to provide a unique id for the item, eg for the checkbox. */
  uniqueId: string
  /** The actual item info, including the  key and label. Use the ItemInfo helpers to get this, for example `getIngredientItemInfo`.  */
  itemInfo: IListItemInfo
  /** Whether the item is selected. */
  selected?: boolean
  /** Whether the checkbox is checkable. */
  checkable?: boolean
  /** What to do when the checkbox is clicked. */
  onCheck?: () => void
  /** Whether the item is a placeholder. */
  isPlaceholder?: boolean
  deletableConfig?: IDeletableListItemConfig
  draggableConfig?: IDraggableListItemConfig
  editableConfig?: IEditableListItemConfig
}

export const ListItem = React.forwardRef<HTMLLIElement | null, IListItemProps>(
  (
    {
      listType,
      uniqueId,
      itemInfo,
      selected,
      checkable = false,
      onCheck,
      deletableConfig,
      draggableConfig,
      editableConfig,
      isPlaceholder,
    },
    ref
  ) => {
    const [isEditing, setIsEditing] = React.useState(false)
    return (
      <li
        key={itemInfo.key}
        ref={ref}
        style={draggableConfig && draggableConfig.style}
        className={classNames(
          'flex gap-2',
          !isPlaceholder && '-mt-[1px]  border-y-[1px] border-gray-200 bg-white'
        )}
      >
        {deletableConfig && (
          <button
            type="button"
            onClick={deletableConfig.onClickDelete}
            disabled={!deletableConfig.isDeletable}
            className="text-red-800 hover:text-red-500 disabled:cursor-not-allowed disabled:text-gray-300"
          >
            <span className="sr-only">remove item {itemInfo.itemLabel}</span>
            <MinusCircleIcon className="h-5 w-5" />
          </button>
        )}
        <div
          className={classNames(
            'relative flex w-full items-center',
            isPlaceholder ? 'h-9' : 'h-14'
          )}
        >
          <div
            className={classNames(
              'absolute w-full transition-all',
              isEditing ? 'visible' : 'invisible opacity-0'
            )}
          >
            {editableConfig?.editInterface}
          </div>
          <button
            className={classNames(
              'absolute w-full transition-all',
              isEditing ? 'invisible opacity-0' : 'visible'
            )}
            onClick={onCheck}
            disabled={!checkable}
          >
            <span className="flex h-full w-full items-center">
              {getItemIcon(listType, selected || isPlaceholder)}
              <div
                className={`min-w-0 flex-1 text-start text-sm ${
                  selected
                    ? 'text-gray-400 line-through decoration-indigo-600 decoration-2'
                    : 'text-gray-700'
                }`}
              >
                {itemInfo.itemLabel}
              </div>
              {checkable && (
                <div className="ml-3 flex h-5 items-center">
                  <input
                    id={`ingredient-${uniqueId}`}
                    name={`ingredient-${uniqueId}`}
                    type="checkbox"
                    checked={selected}
                    onChange={onCheck}
                    className="h-4 w-4 cursor-pointer rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </div>
              )}
            </span>
          </button>
        </div>
        {editableConfig && editableConfig.isEditable && (
          <button type="button" onClick={() => setIsEditing(!isEditing)}>
            <span className="sr-only">
              toggle manual input for item {itemInfo.itemLabel}
            </span>
            {/* Weird margin and height on this one is to make it just a smidge smaller */}
            <PencilIcon className="my-0.5 h-4 text-gray-400 hover:text-gray-500" />
          </button>
        )}
        {draggableConfig && draggableConfig.isDraggable && (
          <button
            type="button"
            {...draggableConfig.listeners}
            {...draggableConfig.attributes}
          >
            <span className="sr-only">move item {itemInfo.itemLabel}</span>
            <Bars3Icon className="h-5 w-5 touch-none text-gray-400 hover:text-gray-500" />
          </button>
        )}
      </li>
    )
  }
)

const getItemIcon = (listType: ListType, selected?: boolean) => {
  const iconProps = {
    className: `mr-3 h-5 w-5 ${
      selected ? 'text-indigo-400' : 'text-indigo-600'
    }`,
    'aria-hidden': true,
  }

  const itemIcon = (() => {
    switch (listType) {
      case 'recipeIngredients':
        return <BeakerIcon {...iconProps} />
      case 'stepOutputUses':
      default:
        return <Square2StackIcon {...iconProps} />
    }
  })()

  return itemIcon
}

export interface IListItemInfo {
  key: string
  itemLabel: JSX.Element
}

export const getIngredientItemInfo = (
  item?: IIngredientItem,
  placeholder?: string
): IListItemInfo => {
  const { quantity, unit, ingredientRef, id } = item || {}
  return {
    key: item
      ? `${quantity}-${unit?.name}-${ingredientRef?.name}`
      : placeholder || 'iteminfo-key',
    itemLabel: (
      <span
        id={`ingredient-${id}-label`}
        className="flex select-none justify-between"
      >
        <span
          className={classNames(
            item !== undefined ? 'font-medium' : 'font-normal text-gray-500'
          )}
        >
          {ingredientRef ? ingredientRef.name : placeholder}
        </span>
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

export const getShoppingListItemInfo = (
  item: IShoppingListItem
): IListItemInfo => {
  const { quantity, unit, ingredientRef, id } = item
  return {
    key: `${ingredientRef.name}`,
    itemLabel: (
      <span
        id={`ingredient-${id}-label`}
        className="flex select-none justify-between"
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

export const getStepOutputUseItemInfo = (
  item: IStepOutputUseItem,
  getStepTitle: (stepNum: number) => string | null | undefined
): IListItemInfo => {
  const { id, outputOfStep } = item
  const { stepNum } = outputOfStep
  const stepTitle = getStepTitle(stepNum)
  return {
    key: `stepoutputusage-${stepNum}-${id}`,
    itemLabel: (
      <span id={`stepoutputusage-${id}-label`} className="select-none ">
        <span className="font-normal">output of </span>
        <span className="font-medium">step {stepNum}</span>
        {stepTitle && <span className="font-medium">: {stepTitle}</span>}
      </span>
    ),
  }
}

export default observer(IngredientsItemsList)
