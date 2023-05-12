import { MetaTags } from '@redwoodjs/web'

import ImportFromPlatform from 'src/components/Recipe/Importing/ImportFromPlatform/ImportFromPlatform'
import ImportFromWebsiteForm from 'src/components/Recipe/Importing/ImportFromWebsiteForm/ImportFromWebsiteForm'
import RecipeImportLoading from 'src/components/Recipe/Importing/RecipeImportLoading/RecipeImportLoading'
import { HeaderSlot } from 'src/layouts/SiteLayout/SiteLayout'

const ImportRecipesPage = () => {
  const [showLoading, setShowLoading] = React.useState(false)
  const [redirectUrl, setRedirectUrl] = React.useState<string | null>(null)

  const [bulkSuccessStats, setBulkSuccessStats] = React.useState<
    { succeeded: number; failed: number; total: number } | undefined
  >()

  const [error, setError] = React.useState<Error | undefined>(undefined)
  const [onRetry, setOnRetry] = React.useState<() => void>(() => () => {})

  const [importSource, setImportSource] = React.useState<
    'website' | 'platform'
  >('website')

  return (
    <div className="mx-3">
      {showLoading && (
        <RecipeImportLoading
          redirectUrl={redirectUrl}
          hasError={!!error}
          setShowLoading={setShowLoading}
          onRetry={onRetry}
          importSource={importSource}
          bulkSuccessStats={bulkSuccessStats}
          setError={setError}
        />
      )}
      <MetaTags title="import recipes" description="Import Recipes page" />
      <HeaderSlot.Plug id="recipe-import">
        <div className="w-screen pt-20 text-center xl:pt-40">
          <span className="pt-20 text-xl text-indigo-700 sm:text-2xl">
            import to
          </span>
          <br />
          <span className="text-5xl sm:text-6xl">spoonjoy</span>
        </div>
      </HeaderSlot.Plug>
      {importSource === 'website' ? (
        <ImportFromWebsiteForm
          setShowLoading={setShowLoading}
          setRedirectUrl={setRedirectUrl}
          setOnRetry={setOnRetry}
          setError={setError}
        />
      ) : (
        <ImportFromPlatform
          uploaderProps={{
            setShowLoading,
            setRedirectUrl,
            bulkSuccessStats,
            setBulkSuccessStats,
            setOnRetry,
            setError,
          }}
        />
      )}
      <div className="mt-2 text-center text-sm">
        or{' '}
        <button
          onClick={() =>
            importSource === 'website'
              ? setImportSource('platform')
              : setImportSource('website')
          }
          className="link"
        >
          import from{' '}
          {importSource === 'website' ? 'another platform' : 'a website'}
        </button>
      </div>
    </div>
  )
}

export default ImportRecipesPage
