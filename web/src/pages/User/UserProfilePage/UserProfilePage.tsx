import { MetaTags } from '@redwoodjs/web'

import UserProfile from 'src/components/User/UserProfile/UserProfile'

interface IUsersProfilePageProps {
  username: string
}
const UsersProfilePage = ({ username }: IUsersProfilePageProps) => {
  return (
    <>
      <MetaTags title={`${username}`} description={`${username}'s pantry.`} />
      <UserProfile username={username} />
    </>
  )
}

export default UsersProfilePage
