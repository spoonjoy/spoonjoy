import { CookbookInfo } from 'types/graphql'

import { routes } from '@redwoodjs/router'

import ListCardBase from 'src/components/shared/ListCard/ListCardBase'
import ListCardContentWithImageBackground from 'src/components/shared/ListCard/ListCardContentWithImageBackground'

const CookbookCard = ({ cookbook }: { cookbook: CookbookInfo }) => (
  <ListCardBase
    linkTo={routes.cookbook({ id: cookbook.id })}
    linkTitle={'Show cookbook ' + cookbook.id + ' detail'}
    smallSquare
  >
    <ListCardContentWithImageBackground
      imageUrl={cookbook.imageUrl}
      cardTitle={cookbook.title}
    />
  </ListCardBase>
)

export default CookbookCard
