import { FindCookbooksForDropdown, RecipeShortInfo } from 'types/graphql'

import { routes } from '@redwoodjs/router'

import { useAuth } from 'src/auth'
import AddToCookbookButton from 'src/components/Cookbook/AddToCookbook/AddToCookbookButton'
import AddToCookbookButtonCell from 'src/components/Cookbook/AddToCookbookButtonCell'
import ActionButtonsContainer from 'src/components/shared/ActionButtons/ActionButtonsContainer/ActionButtonsContainer'
import ShareButton from 'src/components/shared/ActionButtons/ShareButton/ShareButton'
import ListCardBase from 'src/components/shared/ListCard/ListCardBase'
import ListCardContentWithImageBackground from 'src/components/shared/ListCard/ListCardContentWithImageBackground'

const RecipeCard = ({
  recipe,
  myCookbooks,
}: {
  recipe?: RecipeShortInfo
  myCookbooks?: FindCookbooksForDropdown['myCookbooks']
}) => {
  const { currentUser } = useAuth()
  const addToCookbookBtnWrapper = recipe && (
    <ActionButtonsContainer location="list-card" topGradient={!!recipe}>
      <ShareButton />
      {currentUser ? (
        <AddToCookbookButton
          currentRecipeId={recipe.id}
          inMyCookbooks={recipe.inMyCookbooks}
          myCookbooks={myCookbooks}
        />
      ) : (
        <AddToCookbookButton currentRecipeId={recipe.id} inMyCookbooks={null} />
      )}
    </ActionButtonsContainer>
  )
  return (
    <ListCardBase
      linkTo={recipe ? routes.recipe({ id: recipe.id }) : '#'}
      linkTitle={recipe ? 'Show recipe ' + recipe.id + ' detail' : 'loading...'}
      childrenOutsideLink={addToCookbookBtnWrapper}
    >
      <ListCardContentWithImageBackground
        imageUrl={
          recipe?.id &&
          `https://res.cloudinary.com/dpjmyc4uz/image/upload/w_400/${recipe.id}`
        }
        cardTitle={recipe?.title}
        byline={recipe?.chef.username}
        cardSubtitle={recipe?.description}
      />
    </ListCardBase>
  )
}

export default RecipeCard
