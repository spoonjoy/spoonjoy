import { Tab } from '@headlessui/react'

import { navigate, routes, useParams } from '@redwoodjs/router'

import { useAuth } from 'src/auth'
import CookbooksCell from 'src/components/Cookbook/CookbooksCell'
import CreateEditCookbookDialog from 'src/components/Cookbook/CreateEditCookbook/CreateEditCookbookDialog'
import RecipesCell from 'src/components/Recipe/RecipesCell'
import { classNames } from 'src/helpers/css'

import UserProfileBottomBar from '../UserProfileBottomBar'
import UserProfileHeader from '../UserProfileHeader'

interface IUserProfileProps {
  username: string
}

const UserProfile = ({ username }: IUserProfileProps) => {
  const { currentUser } = useAuth()
  const isOwner = currentUser?.username === username

  const { page, newCookbook } = useParams()

  const [selectedTabNum, setSelectedTabNum] = React.useState(
    page === 'cookbook' ? 0 : page === 'recipes' ? 1 : 0
  )
  const onTabChange = (tabNum: number) => {
    setSelectedTabNum(tabNum)
    navigate(
      routes.user({
        username,
        page: tabNum === 0 ? 'cookbooks' : 'recipes',
      })
    )
  }
  const tabNames = ['cookbooks', 'recipes']

  return (
    <>
      <CreateEditCookbookDialog
        dialogOpen={page === 'cookbooks' && newCookbook === 'true' && isOwner}
        onClose={() => {
          navigate(
            routes.user({ username, page: 'cookbooks', newCookbook: false })
          )
        }}
      />
      <UserProfileHeader username={username} />
      <Tab.Group selectedIndex={selectedTabNum} onChange={onTabChange}>
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
        {/* bottom padding is to offset the addrecipecookbook bar */}
        <Tab.Panels className="border-t-2 border-opacity-80 pt-10 pb-[calc(env(safe-area-inset-bottom)+3rem)] sm:pb-0">
          <Tab.Panel>
            <CookbooksCell username={username} />
          </Tab.Panel>
          <Tab.Panel>
            <RecipesCell username={username} />
          </Tab.Panel>
        </Tab.Panels>
        <UserProfileBottomBar />
      </Tab.Group>
    </>
  )
}

export default UserProfile
