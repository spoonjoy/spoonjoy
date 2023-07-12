import { Link, routes } from '@redwoodjs/router'

import SJLogo from 'src/components/Logos/SJLogo'
import { classNames } from 'src/helpers/css'

interface IAuthHeaderProps {
  location: 'login' | 'signup' | 'new-cookbook'
}

const AuthHeader = ({ location }: IAuthHeaderProps) => (
  <div className="sm:mx-auto sm:w-full sm:max-w-md">
    {location !== 'new-cookbook' && <SJLogo className="mx-auto h-12 w-auto" />}

    <h2
      className={classNames(
        'mt-6 text-center text-3xl font-bold tracking-tight text-gray-900'
      )}
    >
      {location === 'signup'
        ? 'sign up for spoonjoy'
        : location === 'new-cookbook'
        ? 'sign up to save this recipe'
        : 'sign in to spoonjoy'}
    </h2>
    <p className="mt-2 text-center text-sm text-gray-600">
      or{' '}
      <Link
        to={
          location === 'signup' || location === 'new-cookbook'
            ? routes.login()
            : routes.signup()
        }
        className="link font-medium"
      >
        {location === 'signup' || location === 'new-cookbook'
          ? 'log in'
          : 'make an account'}
        !
      </Link>
    </p>
  </div>
)

export default AuthHeader
