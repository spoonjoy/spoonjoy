import { PlusIcon } from '@heroicons/react/24/outline'
import type { CookbookInfo } from 'types/graphql'

import { useAuth } from '@redwoodjs/auth'
import { routes } from '@redwoodjs/router'

import EmptyState from 'src/components/shared/EmptyState'
import ListCardBase from 'src/components/shared/ListCard/ListCardBase'

import CookbookCard from './CookbookCard'

const Cookbooks = ({
  cookbooks,
  ownerUsername,
}: {
  cookbooks: CookbookInfo[]
  ownerUsername: string
}) => {
  const { currentUser } = useAuth()
  const isOwner = currentUser?.username === ownerUsername

  return (
    <>
      {cookbooks.length === 0 ? (
        isOwner ? (
          <EmptyState
            header="No cookbooks yet"
            subHeader="Get started by creating a new cookbook."
            ctaRoute={routes.user({
              username: ownerUsername,
              page: 'cookbooks',
              newCookbook: true,
            })}
            cta="New Cookbook"
            isOwner
          />
        ) : (
          <EmptyState
            header="No cookbooks yet"
            subHeader={`${ownerUsername} hasn't created any cookbooks yet.`}
          />
        )
      ) : (
        <div className="align-center flex justify-center">
          <ul className="inline-grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
            {cookbooks.map((cookbook) => (
              <CookbookCard key={cookbook.id} cookbook={cookbook} />
            ))}
            {isOwner && (
              <ListCardBase
                emptyState
                linkTo={routes.user({
                  username: ownerUsername,
                  page: 'cookbooks',
                  newCookbook: true,
                })}
                linkTitle="Create a new cookbook"
                smallSquare
              >
                <div className="inline-flex items-center">
                  <PlusIcon className="h-10 w-10" aria-hidden="true" />
                </div>
              </ListCardBase>
            )}
          </ul>
        </div>
      )}
    </>
  )
}

export default Cookbooks
