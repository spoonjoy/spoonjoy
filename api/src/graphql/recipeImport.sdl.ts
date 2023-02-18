export const schema = gql`
  type RecipeImport {
    returned: String
  }

  enum RecipeImportSource {
    WEBSITE
    CROUTON
  }

  input RecipeImportInput {
    source: RecipeImportSource!
    """
    If from a website, URL of the recipe to import
    """
    url: String
    """
    If from Crouton, the file URL of the exported ZIP file
    """
    fileUrl: String
  }

  type Query {
    importRecipe(input: RecipeImportInput!): RecipeImport @skipAuth
  }
`
