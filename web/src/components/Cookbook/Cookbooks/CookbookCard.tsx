import { CookbookInfo } from 'types/graphql'

import { routes } from '@redwoodjs/router'

import ListCardBase from 'src/components/shared/ListCard/ListCardBase'
import ListCardContentWithImageBackground from 'src/components/shared/ListCard/ListCardContentWithImageBackground'

const RecipeCard = ({ cookbook }: { cookbook: CookbookInfo }) => (
  <ListCardBase
    linkTo={routes.cookbook({ id: cookbook.id })}
    linkTitle={'Show cookbook ' + cookbook.id + ' detail'}
  >
    <ListCardContentWithImageBackground
      imageUrl={cookbook.imageUrl}
      cardTitle={cookbook.title}
    />
  </ListCardBase>
)

export default RecipeCard
