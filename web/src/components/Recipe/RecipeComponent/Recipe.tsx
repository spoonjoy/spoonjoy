import type {
  DeleteRecipeMutationVariables,
  FindRecipeById,
} from 'types/graphql'

import { MetaTags } from '@redwoodjs/web'
import { HeaderSlot } from 'src/layouts/SiteLayout/SiteLayout'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import IngredientsItemsList from 'src/components/IngredientsItemsList/IngredientsItemsList'
import { ListItemType } from 'src/stores/ListItemsStore'

const DELETE_RECIPE_MUTATION = gql`
  mutation DeleteRecipeMutation($id: String!) {
    deleteRecipe(id: $id) {
      id
    }
  }
`

const TimeTag = ({ datetime }: { datetime: string }) => {
  console.log(datetime)
  return (
    <time dateTime={datetime} title={datetime}>
      {new Date(datetime).toUTCString()}
    </time>
  )
}

interface Props {
  recipe: NonNullable<FindRecipeById['recipe']>
}

const Recipe = ({ recipe }: Props) => {
  const [deleteRecipe] = useMutation(DELETE_RECIPE_MUTATION, {
    onCompleted: () => {
      toast.success('Recipe deleted')
      navigate(routes.recipes())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteRecipeMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete recipe ' + id + '?')) {
      deleteRecipe({ variables: { id } })
    }
  }

  return (
    <>
      <MetaTags title="Recipe" description="Recipe" />
      <HeaderSlot.Plug id="recipe">
        <div className=' leading-[.8]'>
          <span>{recipe.title}</span>
          <br />
          <span className="text-sm font-normal ml-2">
            by <span className="font-bold">{recipe.chef.username}</span> on <TimeTag datetime={recipe.createdAt} />
          </span>

        </div>
      </HeaderSlot.Plug>
      <p className="mt-2 text-gray-900">{recipe.description}</p>
      <div>
        {recipe.steps.map((step) => {
          const { stepNum, description, ingredients } = step!
          return (
            <div key={stepNum} className="mt-2">
              <h2 className="text-lg font-medium text-gray-900">
                step {stepNum}
              </h2>
              {ingredients && (
                <div className="m-5">
                  <IngredientsItemsList
                    items={ingredients}
                    itemsType={ListItemType.Ingredient}
                  />
                </div>
              )}
              <div className="pb-5">
                <p>{description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default Recipe
