import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  NumberField,
  DatetimeLocalField,
  Submit,
  useForm,
  HiddenField,
} from '@redwoodjs/forms'

import { DevTool } from '@hookform/devtools'

import type { EditRecipeById, UpdateRecipeInput } from 'types/graphql'
import type { RWGqlError } from '@redwoodjs/forms'
import { useStore } from 'src/stores/RootStore'
import StyledTextField from 'src/components/formComponents/StyledTextField'
import StyledTextAreaField from 'src/components/formComponents/StyledTextAreaField'
import StyledNumberField from 'src/components/formComponents/StyledNumberField'
import { PlusIcon } from '@heroicons/react/20/solid'
import { MinusIcon } from '@heroicons/react/24/outline'
import { observer } from 'mobx-react-lite'
import AddRemBtns from 'src/components/formComponents/AddRemBtns'

const formatDatetime = (value) => {
  if (value) {
    return value.replace(/:\d{2}\.\d{3}\w/, '')
  }
}

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
  } = formMethods

  const onSubmit = (data: FormRecipe) => {
    console.log('onSubmit data:', data)
    // props.onSave(data, props?.recipe?.id)
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
                  const { quantity, unitName, ingredientName } = ingredient
                  return (
                    <div
                      key={`step-${stepNum}-ingredient-${ingIdx}`}
                      className="mt-1 max-w-sm -space-y-px rounded-md shadow-sm"
                    >
                      <div className="flex -space-x-px">
                        <div className="min-w-0">
                          <label
                            htmlFor={`steps[${
                              stepNum - 1
                            }].ingredients[${ingIdx}].quantity`}
                            className="sr-only"
                          >
                            Quantity
                          </label>
                          <NumberField
                            name={`steps[${
                              stepNum - 1
                            }].ingredients[${ingIdx}].quantity`}
                            defaultValue={quantity}
                            className="relative block w-full rounded-none rounded-l-md border-gray-300 bg-transparent focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="5"
                            onChange={(e) => {
                              const { value } = e.target
                              ingredient.setQuantity(Number(value))
                            }}
                          />
                        </div>
                        <div className="min-w-0">
                          <label
                            htmlFor={`steps[${
                              stepNum - 1
                            }].ingredients[${ingIdx}].unitName`}
                            className="sr-only"
                          >
                            Unit name
                          </label>
                          <TextField
                            name={`steps[${
                              stepNum - 1
                            }].ingredients[${ingIdx}].unitName`}
                            defaultValue={unitName}
                            className="relative block w-full rounded-none border-gray-300 bg-transparent focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="cups"
                            onChange={(e) => {
                              const { value } = e.target
                              ingredient.setUnitName(value)
                            }}
                          />
                        </div>
                        <div className="min-w-0">
                          <label
                            htmlFor={`steps[${
                              stepNum - 1
                            }].ingredients[${ingIdx}].ingredientName`}
                            className="sr-only"
                          >
                            Ingredient name
                          </label>
                          <TextField
                            name={`steps[${
                              stepNum - 1
                            }].ingredients[${ingIdx}].ingredientName`}
                            defaultValue={ingredientName}
                            className="relative block w-full rounded-none rounded-r-md border-gray-300 bg-transparent focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="flour"
                            onChange={(e) => {
                              const { value } = e.target
                              ingredient.setIngredientName(value)
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
                <AddRemBtns
                  id="add-rem-ings-btns"
                  itemName="Ingredient"
                  onAdd={() => {
                    step.addIngredient()
                  }}
                  onRem={() => {
                    step.removeIngredient()
                  }}
                  canRem={step.ingredients.length > 1} // need to have at least one ingredient
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
            recipeInputStore.removeStep()
          }}
          canRem={recipeInputStore.steps.length > 0}
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
