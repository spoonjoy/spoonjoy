import RecipeCell from 'src/components/Recipe/RecipeCell'

type RecipePageProps = {
  id: string
}

const RecipePage = ({ id }: RecipePageProps) => {
  return <RecipeCell id={id} />
}

export default RecipePage
