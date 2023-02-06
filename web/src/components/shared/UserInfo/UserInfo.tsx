import ChefRJ from 'public/images/chef-rj.png'

import { classNames } from 'src/helpers/css'

interface IUserInfoProps {
  username: string
  withPhoto?: boolean
  onOneLine?: boolean
}

const UserInfo = ({
  username,
  withPhoto = true,
  onOneLine = false,
}: IUserInfoProps) => {
  return (
    <div className={classNames(onOneLine ? '' : 'mx-2 mt-2', 'flex text-left')}>
      {withPhoto && (
        <img className="h-8 w-8 rounded-full" src={ChefRJ} alt="" />
      )}
      <div className="pl-2">
        <span
          className={classNames(
            onOneLine ? 'inline-block' : 'block',
            'text-xs font-light tracking-normal opacity-[80%]'
          )}
        >
          chef:{onOneLine && '\u00A0'}
        </span>
        <span
          className={classNames(
            onOneLine ? 'inline-block' : 'block',
            'text-sm font-normal leading-none tracking-wide'
          )}
        >
          {username}
        </span>
      </div>
    </div>
  )
}

export default UserInfo
