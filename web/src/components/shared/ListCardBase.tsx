import { Link } from '@redwoodjs/router'

import { classNames } from 'src/helpers/css'

interface IListCardBaseProps {
  children: JSX.Element
  linkTo: string
  linkTitle: string
  emptyState?: boolean
}
const ListCardBase = ({
  children,
  linkTo,
  linkTitle,
  emptyState = false,
}: IListCardBaseProps) => {
  return (
    <li>
      <Link
        className={classNames(
          emptyState
            ? ' rounded-lg border-2 border-dashed border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:h-[270px]'
            : ' group focus:outline-none focus:ring-indigo-500 sm:h-[270px]',
          'flex-center relative flex h-[250px] w-full justify-center text-center'
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
