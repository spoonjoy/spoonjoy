import { FindCookbooksByUser } from 'types/graphql'

const mockCookbookSummaries: Array<Unpacked<FindCookbooksByUser['cookbooks']>> =
  [
    {
      id: 'testId1',
      title: 'Greatest cookbook ever!',
      imageUrl: '',
    },
  ]

export const standard = (/* vars, { ctx, req } */) => ({
  cookbooks: mockCookbookSummaries,
})
