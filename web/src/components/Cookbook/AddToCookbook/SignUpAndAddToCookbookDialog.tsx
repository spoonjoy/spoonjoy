import { Dialog } from '@headlessui/react'

import SignupForm from 'src/components/Auth/SignupForm'
import DialogBase from 'src/components/Dialogs/DialogBase'

interface ISignUpAndAddToCookbookDialogProps {
  isDialogOpen: boolean
  dismissDialog: () => void
}

const SignUpAndAddToCookbookDialog = ({
  isDialogOpen,
  dismissDialog,
}: ISignUpAndAddToCookbookDialogProps) => {
  return (
    <DialogBase
      openState={isDialogOpen}
      onClose={dismissDialog}
      // initialFocusRef={addButtonRef}
      withCloseButton
    >
      <div className=" min-w-[300px]">
        <Dialog.Title
          as="h3"
          className="text-lg font-medium leading-6 text-gray-900"
        >
          <span className="line-through">create cookbook and</span> sign up
        </Dialog.Title>
        <SignupForm />
      </div>
    </DialogBase>
  )
}

export default SignUpAndAddToCookbookDialog
