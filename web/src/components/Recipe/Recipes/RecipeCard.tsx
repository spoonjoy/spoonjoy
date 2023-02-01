import { RecipeShortInfo } from 'types/graphql'

import { routes } from '@redwoodjs/router'

import ListCardBase from 'src/components/shared/ListCard/ListCardBase'
import ListCardContentWithImageBackground from 'src/components/shared/ListCard/ListCardContentWithImageBackground'

const RecipeCard = ({ recipe }: { recipe: RecipeShortInfo }) => (
  <ListCardBase
    linkTo={routes.recipe({ id: recipe.id })}
    linkTitle={'Show recipe ' + recipe.id + ' detail'}
  >
    <ListCardContentWithImageBackground
      imageUrl={recipe.imageUrl}
      cardTitle={recipe.title}
      cardSubtitle={recipe.description}
    />
  </ListCardBase>
)

export default RecipeCard
