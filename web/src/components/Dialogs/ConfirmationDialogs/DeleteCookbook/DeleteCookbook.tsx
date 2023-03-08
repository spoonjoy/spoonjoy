import { navigate, routes } from '@redwoodjs/router'

import { useAuth } from 'src/auth'
import useDeleteCookbookMutation from 'src/components/Cookbook/useDeleteCookbookMutation/useDeleteCookbookMutation'

import Alert from '../Alert'

interface IDeleteCookbookProps {
  cookbookId: string
  isDialogOpen: boolean
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const DeleteCookbook = ({
  cookbookId,
  isDialogOpen,
  setIsDialogOpen,
}: IDeleteCookbookProps) => {
  const { currentUser } = useAuth()

  const { onDelete, loading } = useDeleteCookbookMutation({
    onDeleteCookbookComplete(_) {
      navigate(
        // If user is not logged in, they shouldn't even see this dialog
        routes.user({ username: currentUser!.username, page: 'cookbooks' })
      )
    },
  })

  const onConfirmDelete = () => {
    setIsDialogOpen(false)
    onDelete(cookbookId)
  }
  const onCancelDelete = () => {
    setIsDialogOpen(false)
  }

  return (
    <Alert
      openState={isDialogOpen}
      header={'delete cookbook'}
      body={
        "if you delete your cookbook, you'll never see it again! note that no recipes will be affected."
      }
      confirmTxt={'delete'}
      onConfirm={onConfirmDelete}
      onCancel={onCancelDelete}
      buttonsDisabled={loading}
    />
  )
}

export default DeleteCookbook
