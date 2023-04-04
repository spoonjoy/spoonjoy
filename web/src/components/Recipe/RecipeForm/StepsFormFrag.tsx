import { DragEndEvent, DndContext } from '@dnd-kit/core'
import { cloneDeep } from 'lodash'

import { useFieldArray, useFormContext } from '@redwoodjs/forms'

import AddRemBtns from 'src/components/formComponents/AddRemBtns'
import { usePersistValuesOnChange } from 'src/components/formComponents/usePersistFormValues'

import { IDraggableIngredientData } from './IngredientFormFrag'
import StepFormFrag, { IDroppableStepData } from './StepFormFrag'

import { RecipeFormType } from '.'

const StepsFormFrag = () => {
  const { control, getValues, setValue } = useFormContext<RecipeFormType>()
  const persistValues = usePersistValuesOnChange()

  const {
    fields: steps,
    append: addToSteps,
    remove: removeFromSteps,
  } = useFieldArray({
    control,
    name: 'steps',
  })

  const removeFromIngredients = (stepNum: number, ingIdx: number) => {
    const ingsName: `steps.${number}.ingredients` = `steps.${
      stepNum - 1
    }.ingredients`
    const newIngs = cloneDeep(getValues(ingsName))
    newIngs?.splice(ingIdx, 1)

    setValue(ingsName, newIngs)
  }

  const onDragEnd: (event: DragEndEvent) => void = (event) => {
    console.log('in parent onDragEnd, event', event)

    const draggableIngredientData = event.active.data
      .current as IDraggableIngredientData
    const droppableStepData = event.over?.data.current as
      | IDroppableStepData
      | undefined

    const { stepNum: fromStep, ingIdx } = draggableIngredientData
    const toStep = droppableStepData?.stepNum

    const draggedIngName: `steps.${number}.ingredients.${number}` = `steps.${
      fromStep - 1
    }.ingredients.${ingIdx}`

    if (!toStep) {
      console.log(`dropped ${draggedIngName} on nothing`)
      return
    }
    if (toStep === fromStep) {
      console.log(`dropped ${draggedIngName} on itself`)
      return
    }

    const destinationIngsName: `steps.${number}.ingredients` = `steps.${
      toStep - 1
    }.ingredients`

    console.log(`dropped ${draggedIngName} on ${destinationIngsName}`)

    const draggedIngValue = cloneDeep(getValues(draggedIngName))

    const destinationIngsValue = cloneDeep(getValues(destinationIngsName)) || []

    console.log(`draggedIngValue`, draggedIngValue)
    console.log(`destinationIngsValue`, destinationIngsValue)

    removeFromIngredients(fromStep, ingIdx)

    setValue(destinationIngsName, [...destinationIngsValue, draggedIngValue])
    persistValues()
  }

  return (
    <DndContext onDragEnd={onDragEnd}>
      {steps.map((step) => {
        return (
          <StepFormFrag
            key={step.id}
            // key={`step-${step.stepNum}`}
            recipeId={getValues('recipeId')}
            step={step}
          />
        )
      })}

      <AddRemBtns
        id="add-rem-steps-btns"
        itemName="step"
        onAdd={() => addToSteps({ stepNum: steps.length + 1, description: '' })}
        onRem={() => removeFromSteps(steps.length - 1)}
        canRem={steps.length > 0}
        containerClassName="flex items-center justify-center p-8"
      />
    </DndContext>
  )
}

export default StepsFormFrag
