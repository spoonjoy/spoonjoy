import { Link } from '@redwoodjs/router'

import { classNames } from 'src/helpers/css'

interface IListCardBaseProps {
  /* The content of the card */
  children: React.ReactNode
  /* The route to link to */
  linkTo: string
  /* The title of the link */
  linkTitle: string
  /* Whether or not this is an empty state card */
  emptyState?: boolean
  /* Whether or not this is a small square card */
  smallSquare?: boolean
  /* Components to render outside of the link. Can be absolutely positioned */
  childrenOutsideLink?: React.ReactNode | Element
}

/**
 * This is a base component for a list card.
 */
const ListCardBase = ({
  children,
  linkTo,
  linkTitle,
  emptyState = false,
  smallSquare = false,
  childrenOutsideLink = undefined,
}: IListCardBaseProps) => {
  return (
    <li
      className={classNames(
        smallSquare
          ? 'h-[160px] w-[160px] sm:h-[180px] sm:w-[180px]'
          : 'h-[250px] w-full sm:h-[270px]',
        'group relative'
      )}
    >
      {childrenOutsideLink}
      <Link
        className={classNames(
          emptyState
            ? ' rounded-lg border-2 border-dashed border-gray-300 text-gray-500 group-hover:border-gray-400 group-hover:text-gray-700 group-focus:outline-none group-focus:ring-2 group-focus:ring-indigo-500 group-focus:ring-offset-2'
            : ' group-focus:outline-none group-focus:ring-indigo-500',

          'flex-center flex relative h-full w-full justify-center text-center'
        )}
        to={linkTo}
        title={linkTitle}
      >
        {children}
      </Link>
    </li>
  )
}

export default ListCardBase
