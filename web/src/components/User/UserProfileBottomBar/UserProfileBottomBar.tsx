import { PlusCircleIcon } from '@heroicons/react/24/outline'

import { navigate, routes } from '@redwoodjs/router'

import { useAuth } from 'src/auth'

interface IBottomBarBtnProps {
  onClick: () => void
  title: string
}

const BottomBarBtn = ({ onClick, title }: IBottomBarBtnProps) => (
  <button
    onClick={onClick}
    className="focus:ring-indigo inline-flex h-full w-1/2 items-center justify-center gap-x-1.5 hover:bg-gray-200/50 focus:outline-none focus:ring-2 focus:ring-inset active:bg-gray-200/50"
  >
    <PlusCircleIcon className="h-5 w-5" />
    {title}
  </button>
)

const UserProfileBottomBar = () => {
  const { currentUser } = useAuth()
  return (
    <div className="h-15 fixed bottom-0 left-0 right-0 z-50 h-12 divide-x-2 divide-gray-200/50 border-t-2 border-gray-200/50 bg-white/50 text-gray-800/80 backdrop-blur-lg sm:hidden">
      <BottomBarBtn
        onClick={() => {
          navigate(
            routes.user({
              username: (currentUser?.username as string) || '',
              page: 'cookbooks',
              newCookbook: true,
            })
          )
        }}
        title="cookbook"
      />
      <BottomBarBtn
        onClick={() => {
          navigate(routes.newRecipe())
        }}
        title="recipe"
      />
    </div>
  )
}

export default UserProfileBottomBar
