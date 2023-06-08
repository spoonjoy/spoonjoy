import { useGoogleAuthQuery } from 'src/components/Auth/useOAuthQueries'

const AddAuth = () => {
  const { data: googleUrl } = useGoogleAuthQuery()

  return (
    <div>
      <a href={googleUrl}>Connect Google</a>
    </div>
  )
}

export default AddAuth
