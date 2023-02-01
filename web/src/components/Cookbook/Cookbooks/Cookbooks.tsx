import { PlusIcon } from '@heroicons/react/24/outline'
import type { CookbookInfo } from 'types/graphql'

import { navigate, routes, useParams } from '@redwoodjs/router'

import ListCardBase from 'src/components/shared/ListCard/ListCardBase'

import CreateEditCookbookDialog from '../CreateEditCookbookDialog/CreateEditCookbookDialog'

import CookbookCard from './CookbookCard'

const Cookbooks = ({ cookbooks }: { cookbooks: CookbookInfo[] }) => {
  const { newCookbook } = useParams()
  const [dialogOpen, setDialogOpen] = React.useState(newCookbook === 'true')

  React.useEffect(() => {
    newCookbook === 'true' ? setDialogOpen(true) : setDialogOpen(false)
  }, [newCookbook])

  return (
    <>
      <CreateEditCookbookDialog
        dialogOpen={dialogOpen}
        onClose={() => {
          setDialogOpen(false)
          navigate(routes.myCookbooks({ newCookbook: false }))
        }}
      />
      <div className="align-center flex justify-center">
        <ul className="inline-grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
          {cookbooks.map((cookbook) => (
            <CookbookCard key={cookbook.id} cookbook={cookbook} />
          ))}
          <ListCardBase
            emptyState
            linkTo={routes.myCookbooks({ newCookbook: true })}
            linkTitle="Create a new cookbook"
            smallSquare
          >
            <div className="inline-flex items-center">
              <PlusIcon className="-ml-1 mr-2 h-10 w-10" aria-hidden="true" />
            </div>
          </ListCardBase>
        </ul>
      </div>
    </>
  )
}

export default Cookbooks
