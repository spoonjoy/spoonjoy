import { MetaTags } from '@redwoodjs/web'

import CookbooksCell from 'src/components/Cookbook/CookbooksCell'
import RecipesCell from 'src/components/Recipe/RecipesCell'

interface IUsersProfilePageProps {
  username: string
}
const UsersProfilePage = ({ username }: IUsersProfilePageProps) => {
  return (
    <>
      <MetaTags
        title={`${username} | Spoonjoy`}
        description={`${username}'s Spoonjoy profile.`}
      />
      <RecipesCell username={username} />
      <CookbooksCell username={username} />
    </>
  )
}

export default UsersProfilePage
