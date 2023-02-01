import { Dialog } from '@headlessui/react'

import { navigate, routes } from '@redwoodjs/router'

import DialogBase from 'src/components/Dialogs/DialogBase'

import NewCookbook from '../NewCookbook'

interface ICreatEditCookbookDialogProps {
  dialogOpen: boolean
  onClose: () => void
}

const CreateEditCookbookDialog = ({
  dialogOpen,
  onClose,
}: ICreatEditCookbookDialogProps) => {
  return (
    <DialogBase openState={dialogOpen} onClose={onClose} withCloseButton>
      <Dialog.Title
        as="h3"
        className="text-lg font-medium leading-6 text-gray-900"
      >
        New Cookbook
      </Dialog.Title>
      <NewCookbook />
    </DialogBase>
  )
}

export default CreateEditCookbookDialog
