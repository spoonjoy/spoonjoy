import { navigate, routes } from '@redwoodjs/router'

import CookbookForm from 'src/components/Cookbook/CookbookForm'

import useNewCookbookMutation from '../useNewCookbookMutation'

const NewCookbook = () => {
  const onCreateCookbookComplete = (newCoobookId: string) =>
    navigate(routes.cookbook({ id: newCoobookId }))
  const { onSave, loading, error } = useNewCookbookMutation(
    onCreateCookbookComplete
  )

  return <CookbookForm onSave={onSave} loading={loading} error={error} />
}

export default NewCookbook
