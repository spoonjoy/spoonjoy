import { DevTool } from '@hookform/devtools'
import { observer } from 'mobx-react-lite'
import type { EditRecipeById, UpdateRecipeInput } from 'types/graphql'

import { FieldError, RWGqlError } from '@redwoodjs/forms'
import {
  Form,
  FormError,
  TextField,
  NumberField,
  Submit,
  useForm,
  HiddenField,
} from '@redwoodjs/forms'

import AddRemBtns from 'src/components/formComponents/AddRemBtns'
import StyledNumberField from 'src/components/formComponents/StyledNumberField'
import StyledTextAreaField from 'src/components/formComponents/StyledTextAreaField'
import StyledTextField from 'src/components/formComponents/StyledTextField'
import { useStore } from 'src/stores/RootStore'

import IngredientFormFrag from './IngredientFormFrag'

type FormRecipe = NonNullable<EditRecipeById['recipe']>

interface RecipeFormProps {
  recipe?: EditRecipeById['recipe']
  onSave: (data: UpdateRecipeInput, id?: FormRecipe['id']) => void
  error?: RWGqlError
  loading: boolean
}

const RecipeForm = (props: RecipeFormProps) => {
  const { recipeInputStore } = useStore()
  const formMethods = useForm()
  const {
    formState: { errors },
    control,
    unregister,
  } = formMethods

  const onSubmit = (data: FormRecipe) => {
    console.log('onSubmit data:', data)
    // props.onSave(data, props?.recipe?.id)
  }

  const getIngredientFieldsNames = (stepNum: number, ingIdx: number) => {
    return [
      `steps[${stepNum - 1}].ingredients[${ingIdx}].quantity`,
      `steps[${stepNum - 1}].ingredients[${ingIdx}].unitName`,
      `steps[${stepNum - 1}].ingredients[${ingIdx}].ingredientName`,
    ]
  }

  const getStepFieldsNames = (stepNum: number) => {
    return [
      `steps[${stepNum - 1}].stepNum`,
      `steps[${stepNum - 1}].description`,
    ]
  }

  const removeIngredientFields = (stepNum: number, ingIdx: number) => {
    unregister(getIngredientFieldsNames(stepNum, ingIdx))
  }

  const removeStepFields = (stepNum: number) => {
    const numOfIngs = recipeInputStore.steps[stepNum - 1].ingredients.length
    for (let i = 0; i < numOfIngs; i++) {
      removeIngredientFields(stepNum, i)
    }
    unregister(getStepFieldsNames(stepNum))
  }

  return (
    <div className="p-5">
      <Form<FormRecipe>
        formMethods={formMethods}
        onSubmit={onSubmit}
        error={props.error}
        config={{ mode: 'onBlur' }}
      >
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <StyledTextField
          fieldName="title"
          label="Title"
          defaultValue={recipeInputStore.title}
          onChange={(e) => {
            const { value } = e.target
            recipeInputStore.setTitle(value)
          }}
          validation={{ required: true }}
          fieldErrors={errors.title}
        />

        <StyledTextAreaField
          fieldName="description"
          label="Description"
          defaultValue={recipeInputStore.description}
          onChange={(e) => {
            const { value } = e.target
            recipeInputStore.setDescription(value)
          }}
          fieldErrors={errors.description}
        />

        <StyledNumberField
          fieldName="servings"
          label="Servings"
          defaultValue={recipeInputStore.servings}
          onChange={(e) => {
            const { value } = e.target
            recipeInputStore.setServings(Number(value))
          }}
          fieldErrors={errors.servings}
        />

        {recipeInputStore.steps.map((step) => {
          const { stepNum, description, ingredients } = step
          return (
            <div className="mb-3" key={`step-${stepNum}`}>
              <h2 className="block text-lg font-medium text-gray-700">
                Step {step.stepNum}
              </h2>
              <div className="ml-3 mb-3">
                <legend className="block text-sm font-medium text-gray-700">
                  Step {step.stepNum} Ingredients
                </legend>
                {ingredients.map((ingredient, ingIdx) => {
                  return (
                    <IngredientFormFrag
                      key={`step-${stepNum}-ingredient-${ingIdx}`}
                      stepNum={stepNum}
                      ingIdx={ingIdx}
                      ingredient={ingredient}
                    />
                  )
                })}
                <AddRemBtns
                  id="add-rem-ings-btns"
                  itemName="Ingredient"
                  onAdd={() => {
                    step.addIngredient()
                  }}
                  onRem={() => {
                    removeIngredientFields(stepNum, step.ingredients.length - 1)
                    step.removeIngredient()
                  }}
                  canRem={step.ingredients.length > 1} // need to have at least one ingredient
                  containerClassName="pt-2"
                />
              </div>
              <HiddenField
                name={`steps[${stepNum - 1}].stepNum`}
                defaultValue={stepNum}
              />
              <StyledTextAreaField
                fieldName={`steps[${stepNum - 1}].description`}
                label={`Step ${step.stepNum} Description`}
                defaultValue={description}
                onChange={(e) => {
                  const { value } = e.target
                  step.setDescription(value)
                }}
                fieldErrors={errors.description}
              />
            </div>
          )
        })}

        <AddRemBtns
          id="add-rem-steps-btns"
          itemName="Step"
          onAdd={() => {
            recipeInputStore.addStep()
          }}
          onRem={() => {
            removeStepFields(recipeInputStore.steps.length)
            recipeInputStore.removeStep()
          }}
          canRem={recipeInputStore.steps.length > 0}
          containerClassName="flex items-center justify-center p-8"
        />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
      <DevTool control={control} />
    </div>
  )
}

export default observer(RecipeForm)
