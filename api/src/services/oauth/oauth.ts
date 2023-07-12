import { db } from 'src/lib/db'

const GetConnectedOAuthAccounts = async () => {
  const currentUser = context.currentUser
  const records = await db.oAuth.findMany({
    where: { userId: currentUser!.id },
  })
}
