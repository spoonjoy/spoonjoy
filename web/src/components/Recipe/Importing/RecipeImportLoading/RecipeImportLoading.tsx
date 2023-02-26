import {
  PencilSquareIcon,
  PresentationChartLineIcon,
} from '@heroicons/react/24/solid'
import LogoBlack from 'public/logos/sj_black.svg'

import { navigate } from '@redwoodjs/router'

import { classNames } from 'src/helpers/css'

export interface IRecipeImportLoadingProps {
  redirectUrl: string | null
  hasError: boolean
  setShowLoading: React.Dispatch<React.SetStateAction<boolean>>
  onRetry: () => void
}

const RecipeImportLoading = ({
  redirectUrl,
  hasError,
  setShowLoading,
  onRetry,
}: IRecipeImportLoadingProps) => {
  return (
    <div className="fixed bottom-0 top-0 left-0 right-0 z-50 flex flex-col items-center justify-center gap-2 bg-white">
      <LogoBlack
        className={classNames(
          'h-12 w-auto',
          !redirectUrl && !hasError && 'animate-pulse'
        )}
      />
      <div className="mx-auto max-w-3xl px-5 text-sm leading-5 text-gray-700 sm:text-base">
        <h1 className="mt-2 text-center text-xl font-bold tracking-tight text-gray-800 sm:text-2xl">
          importing your recipe...
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
              make any changes, just hit the edit button below the recipe
            </span>
          </li>
        </ul>
      </div>
      <div className="mt-10">
        {hasError ? (
          <div>
            <button onClick={onRetry} className="btn-error-primary">
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
            got it, go to recipe
          </button>
        )}
      </div>
    </div>
  )
}

export default RecipeImportLoading
