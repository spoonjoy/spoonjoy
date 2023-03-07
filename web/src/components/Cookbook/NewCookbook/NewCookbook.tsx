import { CreateCookbookMutation } from 'types/graphql'

import CookbookForm from 'src/components/Cookbook/CookbookForm'

import useNewCookbookMutation from '../useNewCookbookMutation'

interface INewCookbookProps {
  onCreateCookbookComplete?: (
    newCookbook: CreateCookbookMutation['cookbook']
  ) => void
  inline?: boolean
}

const NewCookbook = ({
  onCreateCookbookComplete,
  inline = false,
}: INewCookbookProps) => {
  const { onSave, loading, error } = useNewCookbookMutation({
    onCreateCookbookComplete,
  })

  return (
    <CookbookForm
      onSave={onSave}
      loading={loading}
      error={error}
      inline={inline}
    />
  )
}

export default NewCookbook
