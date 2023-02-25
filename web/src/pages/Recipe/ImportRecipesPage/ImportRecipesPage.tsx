import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

const ImportRecipesPage = () => {
  return (
    <>
      <MetaTags title="ImportRecipes" description="ImportRecipes page" />

      <h1>ImportRecipesPage</h1>
      <p>
        Find me in{' '}
        <code>./web/src/pages/ImportRecipesPage/ImportRecipesPage.tsx</code>
      </p>
      <p>
        My default route is named <code>importRecipes</code>, link to me with `
        <Link to={routes.importRecipes()}>ImportRecipes</Link>`
      </p>
    </>
  )
}

export default ImportRecipesPage
