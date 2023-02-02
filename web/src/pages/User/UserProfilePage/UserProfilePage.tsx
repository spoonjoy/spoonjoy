import { Tab } from '@headlessui/react'

import { MetaTags } from '@redwoodjs/web'

import CookbooksCell from 'src/components/Cookbook/CookbooksCell'
import RecipesCell from 'src/components/Recipe/RecipesCell'
import { classNames } from 'src/helpers/css'

import UserProfileHeader from '../UserProfileHeader/UserProfileHeader'

interface IUsersProfilePageProps {
  username: string
}
const UsersProfilePage = ({ username }: IUsersProfilePageProps) => {
  const tabNames = ['Cookbooks', 'Recipes']
  return (
    <>
      <MetaTags
        title={`${username}`}
        description={`${username}'s Spoonjoy profile.`}
      />
      <UserProfileHeader username={username} />
      <Tab.Group>
        <div className="w-full">
          <Tab.List className="flex space-x-1">
            {tabNames.map((tabName) => (
              <Tab
                key={tabName}
                className={({ selected }) =>
                  classNames(
                    'rounded-md px-3 py-2 text-sm font-medium',
                    selected
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-500 hover:text-gray-700'
                  )
                }
              >
                {tabName}
              </Tab>
            ))}
          </Tab.List>
        </div>
        <Tab.Panels>
          <Tab.Panel>
            <CookbooksCell username={username} />
          </Tab.Panel>
          <Tab.Panel>
            <RecipesCell username={username} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </>
  )
}

export default UsersProfilePage
