import { Tab } from '@headlessui/react'

import CookbooksCell from 'src/components/Cookbook/CookbooksCell'
import RecipesCell from 'src/components/Recipe/RecipesCell'
import { classNames } from 'src/helpers/css'

import UserProfileHeader from '../UserProfileHeader/UserProfileHeader'

interface IUserProfileProps {
  username: string
}

const UserProfile = ({ username }: IUserProfileProps) => {
  const tabNames = ['Cookbooks', 'Recipes']
  return (
    <>
      <UserProfileHeader username={username} />
      <Tab.Group>
        <div className="w-full pt-8 pb-5">
          <Tab.List className="flex justify-center space-x-1 sm:ml-10 sm:justify-start">
            {tabNames.map((tabName) => (
              <Tab
                key={tabName}
                className={({ selected }) =>
                  classNames(
                    'w-28 rounded-md px-3 py-2 text-sm font-medium',
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
        <Tab.Panels className=" border-t-2 border-opacity-80 pt-8">
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

export default UserProfile
