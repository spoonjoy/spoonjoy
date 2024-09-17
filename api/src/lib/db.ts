// See https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/constructor
// for options.

import { PrismaClient } from '@prisma/client'

import { emitLogLevels, handlePrismaLogging } from '@redwoodjs/api/logger'

import { logger } from './logger'

/*
 * Instance of the Prisma Client
 */
const prismaClient = new PrismaClient({
  log: emitLogLevels(['info', 'warn', 'error']),
})

handlePrismaLogging({
  db: prismaClient,
  logger,
  logLevels: ['info', 'warn', 'error'],
})

export const db = prismaClient.$extends({
  name: 'cookbookImages field',
  result: {
    cookbook: {
      imageUrl: {
        needs: { id: true },
        async compute(cookbook) {
          // The cookbook image is up to 4 recipe images in a grid

          const maybeRecipes = await db.cookbook
            .findUnique({ where: { id: cookbook.id } })
            .recipes({ take: 4 })

          const recipeIds: string[] = []
          maybeRecipes?.forEach((recipe) => {
            recipeIds.push(recipe.recipeId)
          })
          // // Fill up any remaining spots with a transparent box
          // while (recipeIds?.length < 4) {
          //   recipeIds.push('transparent_box')
          // }
          if (recipeIds.length === 0) {
            return 'https://res.cloudinary.com/dpjmyc4uz/image/upload/w_500,h_500,c_fill/cookbook_no_recipes'
          } else if (recipeIds.length < 4) {
            return `https://res.cloudinary.com/dpjmyc4uz/image/upload/w_500,h_500,c_fill/${recipeIds[0]}`
          } else {
            return `https://res.cloudinary.com/dpjmyc4uz/image/upload/w_250,h_250,c_fill/l_${recipeIds[1]},w_250,h_250,c_fill,x_250/l_${recipeIds[2]},w_250,h_250,c_fill,y_250,x_-125/l_${recipeIds[3]},w_250,h_250,c_fill,y_125,x_125/${recipeIds[0]}`
          }
        },
      },
    },
  },
})
