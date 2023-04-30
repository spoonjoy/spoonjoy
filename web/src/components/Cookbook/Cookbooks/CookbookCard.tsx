import { CookbookInfo } from 'types/graphql'

import { routes } from '@redwoodjs/router'

import { useAuth } from 'src/auth'
import ActionButtonsContainer from 'src/components/shared/ActionButtons/ActionButtonsContainer/ActionButtonsContainer'
import ShareButton from 'src/components/shared/ActionButtons/ShareButton/ShareButton'
import ListCardBase from 'src/components/shared/ListCard/ListCardBase'
import ListCardContentWithImageBackground from 'src/components/shared/ListCard/ListCardContentWithImageBackground'

interface IActionButtonsWrapperProps {
  cookbook: CookbookInfo
}

const ActionButtonsWrapper = ({ cookbook }: IActionButtonsWrapperProps) => {
  const { currentUser } = useAuth()

  const { title, author } = cookbook

  const isOwner = currentUser?.id === author.id
  return (
    <ActionButtonsContainer location="list-card">
      <ShareButton
        title={`${author.username}'s "${title}" cookbook`}
        text={
          isOwner
            ? `i LOVE the recipes in my ${title} cookbook`
            : `i LOVE ${author.username}'s ${title} cookbook`
        }
        url={routes.cookbook({ id: cookbook.id })}
      />
    </ActionButtonsContainer>
  )
}

const CookbookCard = ({ cookbook }: { cookbook?: CookbookInfo }) => {
  return (
    <ListCardBase
      linkTo={cookbook ? routes.cookbook({ id: cookbook.id }) : '#'}
      linkTitle={cookbook ? 'Show cookbook ' + cookbook.id + ' detail' : ''}
      childrenOutsideLink={
        cookbook && <ActionButtonsWrapper cookbook={cookbook} />
      }
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
