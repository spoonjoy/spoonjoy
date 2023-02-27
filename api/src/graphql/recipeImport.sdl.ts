export const schema = gql`
  type RecipeID {
    recipeId: ID!
  }

  type BulkImportResult {
    cookbookId: ID!
    importCount: Int!
    failedCount: Int!
  }

  type Mutation {
    importRecipeFromWebsite(url: String!): RecipeID! @skipAuth
    """
    Import a zip files of recipes, exported from Crouton, from a file uploaded to S3.
    $fileKey is the key of the file in S3.
    """
    importRecipesFromCrouton(fileKey: String!): BulkImportResult! @requireAuth
  }
`
