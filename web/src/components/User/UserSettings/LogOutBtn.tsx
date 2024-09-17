import { navigate, routes } from '@redwoodjs/router'
import { toast } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'

const LogOutBtn = () => {
  const { logOut } = useAuth()
  return (
    <button
      className="btn-error"
      onClick={() => {
        logOut()
          .then(() => {
            navigate(routes.welcome())
            toast.success('you have been signed out')
          })
          .catch(() => {
            toast.error('there was a problem with signing you out')
          })
      }}
    >
      sign out from spoonjoy
    </button>
  )
}

export default LogOutBtn
