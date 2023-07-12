import {
  PencilSquareIcon,
  PresentationChartLineIcon,
} from '@heroicons/react/24/solid'

import { navigate } from '@redwoodjs/router'

import ProgressBar from 'src/components/Loading/ProgressBar'
import SJLogo from 'src/components/Logos/SJLogo'
import { classNames } from 'src/helpers/css'

export interface IRecipeImportLoadingProps {
  redirectUrl: string | null
  hasError: boolean
  setShowLoading: React.Dispatch<React.SetStateAction<boolean>>
  onRetry: () => void
  importSource: 'website' | 'platform'
  bulkSuccessStats?: { succeeded: number; failed: number; total: number }
  setError: (error: Error | undefined) => void
}

const RecipeImportLoading = ({
  redirectUrl,
  hasError,
  setShowLoading,
  onRetry,
  importSource,
  bulkSuccessStats,
  setError,
}: IRecipeImportLoadingProps) => {
  return (
    <div className="fixed bottom-0 top-0 left-0 right-0 z-50 flex flex-col items-center justify-center gap-2 bg-white">
      <SJLogo
        className={classNames(
          'h-12 w-auto',
          !redirectUrl && !hasError && 'animate-pulse'
        )}
      />
      <div className="mx-auto max-w-3xl px-5 text-sm leading-5 text-gray-700 sm:text-base">
        <h1 className="mt-2 text-center text-xl font-bold tracking-tight text-gray-800 sm:text-2xl">
          importing your {importSource === 'website' ? 'recipe' : 'recipes'}...
        </h1>
        <p className="mt-8 mb-2 text-center font-bold">
          what you need to know:
        </p>
        <ul className="max-w-xl space-y-2 text-gray-600">
          <li className="flex gap-x-3">
            <PresentationChartLineIcon
              className="mt-1 h-5 w-5 flex-none text-indigo-600"
              aria-hidden="true"
            />
            <span>
              spoonjoy has a{' '}
              <strong className="font-semibold text-gray-800">
                unique recipe structure
              </strong>{' '}
              that makes recipes easier to follow
            </span>
          </li>
          <li className="flex gap-x-3">
            <PencilSquareIcon
              className="mt-1 h-5 w-5 flex-none text-indigo-600"
              aria-hidden="true"
            />
            <span>
              <strong className="font-semibold text-gray-800">
                double check
              </strong>{' '}
              and make sure we&apos;ve gotten everything right - if you want to
              make any changes, just hit the edit button{' '}
              {importSource === 'website'
                ? 'below the recipe'
                : 'at the bottom of each recipe'}
            </span>
          </li>
        </ul>
      </div>
      <div className="mt-10">
        {hasError ? (
          <div>
            <button
              onClick={() => {
                onRetry()
                setError(undefined)
              }}
              className="btn-error-primary"
            >
              try again
            </button>
            <span className="mt-2 block text-center text-sm">
              or {''}
              <button className="link" onClick={() => setShowLoading(false)}>
                go back
              </button>
            </span>
          </div>
        ) : (
          <button
            className={classNames('btn-submit-primary')}
            disabled={!redirectUrl}
            onClick={() => redirectUrl && navigate(redirectUrl)}
          >
            got it, go to {importSource === 'website' ? 'recipe' : 'cookbook'}
          </button>
        )}
      </div>
      <div>
        {bulkSuccessStats && (
          <>
            <ProgressBar
              successAmount={bulkSuccessStats.succeeded}
              failureAmount={bulkSuccessStats.failed}
              totalAmount={bulkSuccessStats.total}
            />
            <div className="text-center text-xs text-gray-400">
              <span className="mb-1 block">
                {bulkSuccessStats.succeeded === 0
                  ? 'no recipes imported'
                  : `${bulkSuccessStats.succeeded} ${
                      bulkSuccessStats.succeeded === 1 ? 'recipe' : 'recipes'
                    } imported`}
              </span>
              <span>
                {bulkSuccessStats.failed === 0
                  ? 'no failures'
                  : `${bulkSuccessStats.failed} failed`}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default RecipeImportLoading
