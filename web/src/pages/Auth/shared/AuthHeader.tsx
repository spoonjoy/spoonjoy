import { Link, routes } from '@redwoodjs/router'

import LogoBlack from 'src/layouts/SiteLayout/sj_black.svg'

interface IAuthHeaderProps {
  location: 'login' | 'signup'
}

const AuthHeader = ({ location }: IAuthHeaderProps) => (
  <div className="sm:mx-auto sm:w-full sm:max-w-md">
    <LogoBlack className="mx-auto h-12 w-auto" />

    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
      {location === 'signup' ? 'sign up for spoonjoy' : 'sign in to spoonjoy'}
    </h2>
    <p className="mt-2 text-center text-sm text-gray-600">
      or{' '}
      <Link
        to={location === 'signup' ? routes.login() : routes.signup()}
        className="font-medium text-indigo-600 hover:text-indigo-500"
      >
        {location === 'signup' ? 'log in' : 'make an account'}!
      </Link>
    </p>
  </div>
)

export default AuthHeader
