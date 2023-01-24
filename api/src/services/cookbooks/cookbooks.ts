import type {
  QueryResolvers,
  MutationResolvers,
  CookbookRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const cookbooks: QueryResolvers['cookbooks'] = () => {
  return db.cookbook.findMany()
}

export const cookbook: QueryResolvers['cookbook'] = ({ id }) => {
  return db.cookbook.findUnique({
    where: { id },
  })
}

export const createCookbook: MutationResolvers['createCookbook'] = ({
  input,
}) => {
  return db.cookbook.create({
    data: input,
  })
}

export const updateCookbook: MutationResolvers['updateCookbook'] = ({
  id,
  input,
}) => {
  return db.cookbook.update({
    data: input,
    where: { id },
  })
}

export const deleteCookbook: MutationResolvers['deleteCookbook'] = ({ id }) => {
  return db.cookbook.delete({
    where: { id },
  })
}

export const Cookbook: CookbookRelationResolvers = {
  author: (_obj, { root }) => {
    return db.cookbook.findUnique({ where: { id: root?.id } }).author()
  },
  recipes: (_obj, { root }) => {
    return db.cookbook.findUnique({ where: { id: root?.id } }).recipes()
  },
}
