import RecipeCell from 'src/components/Recipe/RecipeCell'

interface IRecipePageProps {
  id: string
}

const RecipePage = ({ id }: IRecipePageProps) => {
  return <RecipeCell id={id} />
}

export default RecipePage
