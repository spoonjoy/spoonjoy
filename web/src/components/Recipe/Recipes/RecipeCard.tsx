import { RecipeShortInfo } from 'types/graphql'

import { useAuth } from '@redwoodjs/auth'
import { routes } from '@redwoodjs/router'

import AddToCookbookButtonCell from 'src/components/Cookbook/AddToCookbookButtonCell'
import ListCardBase from 'src/components/shared/ListCard/ListCardBase'
import ListCardContentWithImageBackground from 'src/components/shared/ListCard/ListCardContentWithImageBackground'
import UserInfo from 'src/components/shared/UserInfo/UserInfo'

const RecipeCard = ({ recipe }: { recipe: RecipeShortInfo }) => {
  const { currentUser } = useAuth()
  const isNotOwnRecipe = currentUser?.id !== recipe.chef.id
  const addToCookbookBtnWrapper = (
    <div className="absolute top-3 right-3 z-20">
      {recipe.inMyCookbooks && currentUser?.username && (
        <AddToCookbookButtonCell
          currentRecipeId={recipe.id}
          inMyCookbooks={recipe.inMyCookbooks}
          username={currentUser.username}
        />
      )}
    </div>
  )
  return (
    <ListCardBase
      linkTo={routes.recipe({ id: recipe.id })}
      linkTitle={'Show recipe ' + recipe.id + ' detail'}
      childrenOutsideLink={addToCookbookBtnWrapper}
    >
      {isNotOwnRecipe && (
        <>
          <div className="absolute left-0 top-0 right-0 z-10 flex h-16 items-center rounded-t-lg bg-gradient-to-b from-black to-transparent text-white">
            <UserInfo
              username={recipe.chef.username}
              withPhoto={false}
              onOneLine={true}
            />
          </div>
        </>
      )}
      <ListCardContentWithImageBackground
        imageUrl={recipe.imageUrl}
        cardTitle={recipe.title}
        cardSubtitle={recipe.description}
      />
    </ListCardBase>
  )
}

export default RecipeCard
