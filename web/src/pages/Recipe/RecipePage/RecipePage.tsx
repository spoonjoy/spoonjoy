import { MetaTags } from '@redwoodjs/web'
import RecipeCell from 'src/components/Recipe/RecipeCell'
import { HeaderSlot } from 'src/layouts/SiteLayout/SiteLayout'

type RecipePageProps = {
  id: string
}

const RecipePage = ({ id }: RecipePageProps) => {
  return (
    <>
      <MetaTags title="Recipe" description="Recipe" />
      <HeaderSlot.Plug id="home">View Recipe</HeaderSlot.Plug>
      <RecipeCell id={id} />
    </>
  )
}

export default RecipePage
