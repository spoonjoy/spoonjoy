import { Dialog } from '@headlessui/react'

import DialogBase from 'src/components/Dialogs/DialogBase'

interface ISignUpAndAddToCookbookDialogProps {
  isDialogOpen: boolean
  setIsDialogOpen: (isOpen: boolean) => void
  dismissDialog: () => void
}

const SignUpAndAddToCookbookDialog = ({
  isDialogOpen,
  setIsDialogOpen,
  dismissDialog,
}: ISignUpAndAddToCookbookDialogProps) => {
  return (
    <DialogBase
      openState={isDialogOpen}
      onClose={dismissDialog}
      // initialFocusRef={addButtonRef}
      withCloseButton
    >
      <Dialog.Title
        as="h3"
        className="text-lg font-medium leading-6 text-gray-900"
      >
        Sign up and add to cookbook
      </Dialog.Title>
    </DialogBase>
  )
}

export default SignUpAndAddToCookbookDialog
