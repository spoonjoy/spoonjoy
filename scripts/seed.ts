import type { Prisma } from '@prisma/client'
import { db } from 'api/src/lib/db'
import { getPizzaScenarioData } from 'api/src/services/recipes/recipes.scenarios'

import { hashPassword } from '@redwoodjs/api'

export default async () => {
  try {
    //
    // Manually seed via `yarn rw prisma db seed`
    // Seeds automatically with `yarn rw prisma migrate dev` and `yarn rw prisma migrate reset`

    // Because we're using dbAuth, we need need to add a `hashedPassword`
    // and associated `salt` to their record. This uses
    // the same algorithm that dbAuth uses internally:
    const testUserPassword = 'test'
    const [hashedPassword, salt] = hashPassword(testUserPassword)

    const admin = {
      username: 'ari',
      email: 'ari@spoonjoy.app',
      hashedPassword,
      salt,
    }

    const users: Prisma.UserCreateArgs['data'][] = [
      {
        username: 'ari',
        email: 'ari@spoonjoy.app',
        hashedPassword,
        salt,
      },
    ]

    // Because we're using PostgreSQL, using `createMany` to insert multiple records is much faster
    // https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#createmany
    await db.user.createMany({ data: users })

    const adminData = await db.user.findUnique({
      where: { username: admin.username },
    })

    const pizzaRecipe: Prisma.RecipeCreateArgs['data'] = getPizzaScenarioData(
      adminData!.id
    )

    await db.recipe.create({ data: pizzaRecipe })
  } catch (error) {
    console.warn('There was an issue with seeding.')
    console.error(error)
  }
}
