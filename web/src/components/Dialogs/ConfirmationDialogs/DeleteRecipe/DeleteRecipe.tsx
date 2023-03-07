import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/dist/toast'

import Alert from '../Alert'

const DELETE_RECIPE_MUTATION = gql`
  mutation DeleteRecipeMutation($id: String!) {
    deleteRecipe(id: $id) {
      id
    }
  }
`

interface IDeleteRecipeProps {
  recipeId: string
  ownerUsername: string
  isDialogOpen: boolean
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const DeleteRecipe = ({
  recipeId,
  ownerUsername,
  isDialogOpen,
  setIsDialogOpen,
}: IDeleteRecipeProps) => {
  const [deleteRecipe] = useMutation(DELETE_RECIPE_MUTATION, {
    onCompleted: () => {
      toast.success('recipe deleted')
      navigate(routes.user({ username: ownerUsername }))
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onConfirmDelete = () => {
    setIsDialogOpen(false)
    deleteRecipe({ variables: { id: recipeId } })
  }
  const onCancelDelete = () => {
    setIsDialogOpen(false)
  }

  return (
    <Alert
      openState={isDialogOpen}
      header={'delete recipe'}
      body={
        'if you delete your recipe, you\'ll never see it again! until we get around to creating the "recently deleted" section, but who knows how long that will take.'
      }
      confirmTxt={'delete'}
      onConfirm={onConfirmDelete}
      onCancel={onCancelDelete}
    />
  )
}

export default DeleteRecipe
