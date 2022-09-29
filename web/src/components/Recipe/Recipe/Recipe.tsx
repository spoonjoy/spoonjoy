import type {
  DeleteRecipeMutationVariables,
  FindRecipeById,
} from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

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
      <h2 className="text-center">
        <span className="font-serif text-3xl">{recipe.title}</span>
        <br />
        <span>
          by <span className="font-bold">{recipe.chef.username}</span>
        </span>
        <br />
        <span className="text-xs">
          created <TimeTag datetime={recipe.createdAt} />
        </span>
      </h2>
      <p className="mt-2 text-center">{recipe.description}</p>
      <div>
        {recipe.steps.map((step) => {
          const { stepNum, description, ingredients } = step!
          return (
            <div key={stepNum} className="mt-2">
              <h3>step {stepNum}</h3>
              <ul>
                {ingredients.map((ingredient) => {
                  const { quantity, unit, ingredientRef } = ingredient!
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
              <p>{step?.description}</p>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default Recipe
