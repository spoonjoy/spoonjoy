import { RecipeShortInfo } from 'types/graphql'

import { useAuth } from '@redwoodjs/auth'
import { routes } from '@redwoodjs/router'

import ListCardBase from 'src/components/shared/ListCard/ListCardBase'
import ListCardContentWithImageBackground from 'src/components/shared/ListCard/ListCardContentWithImageBackground'
import UserInfo from 'src/components/shared/UserInfo/UserInfo'

const RecipeCard = ({ recipe }: { recipe: RecipeShortInfo }) => {
  const { currentUser } = useAuth()
  const isNotOwnRecipe = currentUser?.id !== recipe.chef.id
  return (
    <ListCardBase
      linkTo={routes.recipe({ id: recipe.id })}
      linkTitle={'Show recipe ' + recipe.id + ' detail'}
    >
      {isNotOwnRecipe && (
        <>
          <div className="absolute left-0 top-0 right-0 z-10 h-16 rounded-t-lg bg-gradient-to-b from-black to-transparent text-white">
            <UserInfo username={recipe.chef.username} />
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
