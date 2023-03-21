import { CookbookInfo } from 'types/graphql'

import { routes } from '@redwoodjs/router'

import ActionButtonsContainer from 'src/components/shared/ActionButtons/ActionButtonsContainer/ActionButtonsContainer'
import ShareButton from 'src/components/shared/ActionButtons/ShareButton/ShareButton'
import ListCardBase from 'src/components/shared/ListCard/ListCardBase'
import ListCardContentWithImageBackground from 'src/components/shared/ListCard/ListCardContentWithImageBackground'

const CookbookCard = ({ cookbook }: { cookbook?: CookbookInfo }) => {
  const actionButtonsWrapper = cookbook && (
    <ActionButtonsContainer location="list-card">
      <ShareButton />
    </ActionButtonsContainer>
  )
  return (
    <ListCardBase
      linkTo={cookbook ? routes.cookbook({ id: cookbook.id }) : '#'}
      linkTitle={cookbook ? 'Show cookbook ' + cookbook.id + ' detail' : ''}
      childrenOutsideLink={actionButtonsWrapper}
      smallSquare
    >
      <ListCardContentWithImageBackground
        imageUrl={cookbook?.imageUrl}
        cardTitle={cookbook?.title}
      />
    </ListCardBase>
  )
}

export default CookbookCard
