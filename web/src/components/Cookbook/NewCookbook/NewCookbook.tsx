import { navigate, routes } from '@redwoodjs/router'

import CookbookForm from 'src/components/Cookbook/CookbookForm'

import withNewCookbookMutation from '../withNewCookbookMutation/withNewCookbookMutation'

export default withNewCookbookMutation({
  child: CookbookForm,
  onCreateCookbookComplete: (newCoobookId) =>
    navigate(routes.cookbook({ id: newCoobookId })),
  outerProps: {},
})
