import { PlusIcon } from '@heroicons/react/24/outline'
import type { CookbookInfo } from 'types/graphql'

import { useAuth } from '@redwoodjs/auth'
import { navigate, routes, useParams } from '@redwoodjs/router'

import EmptyState from 'src/components/shared/EmptyState'
import ListCardBase from 'src/components/shared/ListCard/ListCardBase'

import CreateEditCookbookDialog from '../CreateEditCookbook/CreateEditCookbookDialog'

import CookbookCard from './CookbookCard'

const Cookbooks = ({
  cookbooks,
  ownerUsername,
}: {
  cookbooks: CookbookInfo[]
  ownerUsername: string
}) => {
  const { newCookbook } = useParams()

  const { currentUser } = useAuth()
  const isOwner = currentUser?.username === ownerUsername

  return (
    <>
      <CreateEditCookbookDialog
        dialogOpen={newCookbook === 'true'}
        onClose={() => {
          navigate(routes.myCookbooks({ newCookbook: false }))
        }}
      />
      {cookbooks.length === 0 ? (
        isOwner ? (
          <EmptyState
            header="No cookbooks yet"
            subHeader="Get started by creating a new cookbook."
            ctaRoute={routes.myCookbooks({ newCookbook: true })}
            cta="New Cookbook"
            isOwner
          />
        ) : (
          <EmptyState
            header="No cookbooks yet"
            subHeader={`${ownerUsername} hasn't created any cookbooks yet.`}
            ctaRoute={routes.myCookbooks({ newCookbook: true })}
            cta="New Cookbook"
          />
        )
      ) : (
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
      )}
    </>
  )
}

export default Cookbooks
