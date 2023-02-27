import type { Decoded } from '@redwoodjs/api'
import { AuthenticationError, ForbiddenError } from '@redwoodjs/graphql-server'

import { db } from './db'

export interface ICurrentUser {
  id: string
  username: string
}

/**
 * The session object sent in as the first argument to getCurrentUser() will
 * have a single key `id` containing the unique ID of the logged in user
 * (whatever field you set as `authFields.id` in your auth function config).
 * You'll need to update the call to `db` below if you use a different model
 * name or unique field name, for example:
 *
 *   return await db.profile.findUnique({ where: { email: session.id } })
 *                   ───┬───                       ──┬──
 *      model accessor ─┘      unique id field name ─┘
 *
 * !! BEWARE !! Anything returned from this function will be available to the
 * client--it becomes the content of `currentUser` on the web side (as well as
 * `context.currentUser` on the api side). You should carefully add additional
 * fields to the `select` object below once you've decided they are safe to be
 * seen if someone were to open the Web Inspector in their browser.
 */

export const getCurrentUser = async (
  session: Decoded
): Promise<ICurrentUser> => {
  if (!session || typeof session.id !== 'string') {
    throw new Error('Invalid session')
  }

  const user = await db.user.findUnique({
    where: { id: session.id },
    select: { id: true, username: true },
  })
  if (!user) throw new AuthenticationError('You are not logged in.')
  else return user
}

/**
 * The user is authenticated if there is a currentUser in the context
 *
 * @returns {boolean} - If the currentUser is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!context.currentUser
}

/**
 * When checking role membership, roles can be a single value, a list, or none.
 * You can use Prisma enums too (if you're using them for roles), just import your enum type from `@prisma/client`
 */
type AllowedRoles = string | string[] | undefined

/**
 * Checks if the currentUser is authenticated (and assigned one of the given roles)
 *
 * @param roles: {@link AllowedRoles} - Checks if the currentUser is assigned one of these roles
 *
 * @returns {boolean} - Returns true if the currentUser is logged in and assigned one of the given roles,
 * or when no roles are provided to check against. Otherwise returns false.
 */
export const hasRole = (roles: AllowedRoles): boolean => {
  if (!isAuthenticated()) {
    return false
  }

  const currentUserRoles = context.currentUser?.roles

  if (typeof roles === 'string') {
    if (typeof currentUserRoles === 'string') {
      // roles to check is a string, currentUser.roles is a string
      return currentUserRoles === roles
    } else if (Array.isArray(currentUserRoles)) {
      // roles to check is a string, currentUser.roles is an array
      return currentUserRoles?.some((allowedRole) => roles === allowedRole)
    }
  }

  if (Array.isArray(roles)) {
    if (Array.isArray(currentUserRoles)) {
      // roles to check is an array, currentUser.roles is an array
      return currentUserRoles?.some((allowedRole) =>
        roles.includes(allowedRole)
      )
    } else if (typeof currentUserRoles === 'string') {
      // roles to check is an array, currentUser.roles is a string
      return roles.some((allowedRole) => currentUserRoles === allowedRole)
    }
  }

  // roles not found
  return false
}

/**
 * Use requireAuth in your services to check that a user is logged in,
 * whether or not they are assigned a role, and optionally raise an
 * error if they're not.
 *
 * @param roles: {@link AllowedRoles} - When checking role membership, these roles grant access.
 *
 * @returns - If the currentUser is authenticated (and assigned one of the given roles)
 *
 * @throws {@link AuthenticationError} - If the currentUser is not authenticated
 * @throws {@link ForbiddenError} If the currentUser is not allowed due to role permissions
 *
 * @see https://github.com/redwoodjs/redwood/tree/main/packages/auth for examples
 */
export const requireAuth = ({
  roles,
  customErrorMessage,
}: { roles?: AllowedRoles; customErrorMessage?: string } = {}) => {
  if (!isAuthenticated()) {
    throw new AuthenticationError(
      customErrorMessage || 'You are not logged in!'
    )
  }

  if (roles && !hasRole(roles)) {
    throw new ForbiddenError(
      customErrorMessage || "You don't have access to do that."
    )
  }
}

/**
 * Use requireRecipeAuth for checking that a user can modify/delete a recipe
 *
 * @param recipeId - The ID of the recipe for which we are checking auth
 *
 * @returns - If the currentUser is authenticated (and allowed to make changes to the given recipe)
 *
 * @throws {@link AuthenticationError} - If the currentUser is not authenticated
 * @throws {@link ForbiddenError} If the currentUser is not allowed due to the recipe not being theirs
 */
export const requireRecipeAuth = async (recipeId: string) => {
  if (!isAuthenticated()) {
    throw new AuthenticationError('You are not logged in!')
  }

  const recipeBasicInfo = await db.recipe.findUnique({
    where: { id: recipeId },
  })

  if (context.currentUser!.id !== recipeBasicInfo!.chefId) {
    throw new ForbiddenError('You can only modify your own recipes!')
  }
}

/**
 * Use requireShoppingListAuth for checking that a user can modify/delete a shoppingList
 *
 * @param shoppingListId - The ID of the shoppingList for which we are checking auth
 *
 * @returns - If the currentUser is authenticated (and allowed to make changes to the given shoppingList)
 *
 * @throws {@link AuthenticationError} - If the currentUser is not authenticated
 * @throws {@link ForbiddenError} If the currentUser is not allowed due to the shoppingList not being theirs
 */
export const requireShoppingListAuth = async (shoppingListId: string) => {
  if (!isAuthenticated()) {
    throw new AuthenticationError('You are not logged in!')
  }

  const shoppingListBasicInfo = await db.shoppingList.findUnique({
    where: { id: shoppingListId },
  })

  if (context.currentUser!.id !== shoppingListBasicInfo!.authorId) {
    throw new ForbiddenError('You can only modify your own shoppingLists!')
  }
}

/**
 * Use requireCookbookAuth for checking that a user can modify/delete a cookbook
 *
 * @param cookbookId - The ID of the cookbook for which we are checking auth
 *
 * @returns - If the currentUser is authenticated (and allowed to make changes to the given cookbook)
 *
 * @throws {@link AuthenticationError} - If the currentUser is not authenticated
 * @throws {@link ForbiddenError} If the currentUser is not allowed due to the cookbook not being theirs
 */
export const requireCookbookAuth = async (cookbookId: string) => {
  if (!isAuthenticated()) {
    throw new AuthenticationError('You are not logged in!')
  }

  const cookbookBasicInfo = await db.cookbook.findUnique({
    where: { id: cookbookId },
  })

  if (context.currentUser!.id !== cookbookBasicInfo!.authorId) {
    throw new ForbiddenError('You can only modify your own cookbooks!')
  }
}
