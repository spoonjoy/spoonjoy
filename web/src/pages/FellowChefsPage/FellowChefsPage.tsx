import { MetaTags } from '@redwoodjs/web'

import UsersFellowChefsCell from 'src/components/UsersFellowChefsCell'

interface IFellowChefsPageProps {
  username: string
}

const FellowChefsPage = ({ username }: IFellowChefsPageProps) => {
  return (
    <>
      <MetaTags title="FellowChefs" description="FellowChefs page" />

      <UsersFellowChefsCell username={username} />
    </>
  )
}

export default FellowChefsPage
