// See https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/constructor
// for options.

import { PrismaClient } from '@prisma/client'

import { emitLogLevels, handlePrismaLogging } from '@redwoodjs/api/logger'

import { logger } from './logger'

/*
 * Instance of the Prisma Client
 */
export const db = new PrismaClient({
  log: emitLogLevels(['info', 'warn', 'error']),
}).$extends({
  result: {
    cookbook: {
      imageUrl: {
        needs: { id: true },
        compute(cookbook) {
          // The cookbook image is up to 4 recipe images in a grid

          db.cookbook
            .findUnique({ where: { id: cookbook.id } })
            .recipes({ take: 4 })
            .then((maybeRecipes) => {
              const recipeIds: string[] = []
              maybeRecipes?.forEach((recipe) => {
                recipeIds.push(recipe.recipeId)
              })
              // Fill up any remaining spots with a transparent box
              while (recipeIds?.length < 4) {
                recipeIds.push('transparent_box')
              }

              return `https://res.cloudinary.com/dpjmyc4uz/image/upload/w_250,h_250,c_fill/l_${recipeIds[1]},w_250,h_250,c_fill,x_250/l_${recipeIds[2]},w_250,h_250,c_fill,y_250,x_-125/l_${recipeIds[3]},w_250,h_250,c_fill,y_125,x_125/${recipeIds[0]}`
            })
        },
      },
    },
  },
})

handlePrismaLogging({
  db,
  logger,
  logLevels: ['info', 'warn', 'error'],
})
