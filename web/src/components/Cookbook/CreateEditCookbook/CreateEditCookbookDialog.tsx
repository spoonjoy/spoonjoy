import { Dialog } from '@headlessui/react'

import DialogBase from 'src/components/Dialogs/DialogBase'

import EditCookbookCell from '../EditCookbookCell'
import NewCookbook from '../NewCookbook'

interface ICreatEditCookbookDialogProps {
  dialogOpen: boolean
  onClose: () => void
  editCookbookId?: string
}

const CreateEditCookbookDialog = ({
  dialogOpen,
  onClose,
  editCookbookId,
}: ICreatEditCookbookDialogProps) => {
  return (
    <DialogBase openState={dialogOpen} onClose={onClose} withCloseButton>
      <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <Dialog.Title
          as="h3"
          className="text-lg font-medium leading-6 text-gray-900"
        >
          {editCookbookId ? 'Edit' : 'Create'} Cookbook
        </Dialog.Title>
        {editCookbookId ? (
          <EditCookbookCell id={editCookbookId} />
        ) : (
          <NewCookbook />
        )}
      </div>
    </DialogBase>
  )
}

export default CreateEditCookbookDialog
