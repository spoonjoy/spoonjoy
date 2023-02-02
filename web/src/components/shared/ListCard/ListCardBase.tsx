import { Link } from '@redwoodjs/router'

import { classNames } from 'src/helpers/css'

interface IListCardBaseProps {
  children: React.ReactNode
  linkTo: string
  linkTitle: string
  emptyState?: boolean
  smallSquare?: boolean
}

/**
 * This is a base component for a list card.
 * @param children The content of the card
 * @param linkTo The route to link to
 * @param linkTitle The title of the link
 * @param emptyState Whether or not this is an empty state card
 * @param smallSquare Whether or not this is a small square card
 * @returns A list card
 */
const ListCardBase = ({
  children,
  linkTo,
  linkTitle,
  emptyState = false,
  smallSquare = false,
}: IListCardBaseProps) => {
  return (
    <li
      className={classNames(
        smallSquare
          ? 'h-[160px] w-[160px] sm:h-[180px] sm:w-[180px]'
          : 'h-[250px] w-full sm:h-[270px]'
      )}
    >
      <Link
        className={classNames(
          emptyState
            ? ' rounded-lg border-2 border-dashed border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
            : ' group focus:outline-none focus:ring-indigo-500',

          'flex-center relative flex h-full w-full justify-center text-center'
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
