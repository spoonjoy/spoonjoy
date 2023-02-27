import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import ImportFromWebsiteForm from 'src/components/Recipe/Importing/ImportFromWebsiteForm/ImportFromWebsiteForm'
import RecipeImportLoading from 'src/components/Recipe/Importing/RecipeImportLoading/RecipeImportLoading'
import { HeaderSlot } from 'src/layouts/SiteLayout/SiteLayout'

const ImportRecipesPage = () => {
  const [showLoading, setShowLoading] = React.useState(false)
  const [redirectUrl, setRedirectUrl] = React.useState<string | null>(null)

  const [error, setError] = React.useState<Error | undefined>(undefined)
  const [onRetry, setOnRetry] = React.useState<() => void>(() => {})

  return (
    <>
      {showLoading && (
        <RecipeImportLoading
          redirectUrl={redirectUrl}
          hasError={!!error}
          setShowLoading={setShowLoading}
          onRetry={onRetry}
        />
      )}
      <MetaTags title="import recipes" description="Import Recipes page" />
      <HeaderSlot.Plug id="recipe-import">
        <div className="mt-20 w-screen text-center xl:mt-40">
          <span className="text-xl text-indigo-700 sm:text-2xl">import to</span>
          <br />
          <span className="text-5xl sm:text-6xl">spoonjoy</span>
        </div>
      </HeaderSlot.Plug>
      <ImportFromWebsiteForm
        setShowLoading={setShowLoading}
        setRedirectUrl={setRedirectUrl}
        setOnRetry={setOnRetry}
        setError={setError}
      />
      <div className="mt-2 text-center text-sm">
        or{' '}
        <Link to={routes.importRecipesFromPlatform()} className="link">
          import from another platform
        </Link>
      </div>
    </>
  )
}

export default ImportRecipesPage
