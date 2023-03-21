export const COOKBOOK_INFO = gql`
  fragment CookbookInfo on Cookbook {
    id
    title
    imageUrl
    author {
      id
      username
    }
  }
`
