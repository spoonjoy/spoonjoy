import { RecipeShortInfo } from 'types/graphql'

import { routes } from '@redwoodjs/router'

import { useAuth } from 'src/auth'
import AddToCookbookButton from 'src/components/Cookbook/AddToCookbook/AddToCookbookButton'
import AddToCookbookButtonCell from 'src/components/Cookbook/AddToCookbookButtonCell'
import ListCardBase from 'src/components/shared/ListCard/ListCardBase'
import ListCardContentWithImageBackground from 'src/components/shared/ListCard/ListCardContentWithImageBackground'

const RecipeCard = ({ recipe }: { recipe: RecipeShortInfo }) => {
  const { currentUser } = useAuth()
  const addToCookbookBtnWrapper = (
    <div className="absolute top-5 right-4 z-20">
      {currentUser ? (
        <AddToCookbookButtonCell
          currentRecipeId={recipe.id}
          inMyCookbooks={recipe.inMyCookbooks}
          username={currentUser.username}
        />
      ) : (
        <AddToCookbookButton currentRecipeId={recipe.id} inMyCookbooks={null} />
      )}
    </div>
  )
  return (
    <ListCardBase
      linkTo={routes.recipe({ id: recipe.id })}
      linkTitle={'Show recipe ' + recipe.id + ' detail'}
      childrenOutsideLink={addToCookbookBtnWrapper}
    >
      <div className="absolute left-0 top-0 right-0 z-10 flex h-16 rounded-t-lg bg-gradient-to-b from-black to-transparent text-white opacity-70" />
      <ListCardContentWithImageBackground
        imageUrl={recipe.imageUrl}
        cardTitle={recipe.title}
        byline={recipe.chef.username}
        cardSubtitle={recipe.description}
      />
    </ListCardBase>
  )
}

export default RecipeCard
