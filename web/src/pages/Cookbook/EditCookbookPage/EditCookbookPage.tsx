import EditCookbookCell from 'src/components/Cookbook/EditCookbookCell'

type CookbookPageProps = {
  id: string
}

const EditCookbookPage = ({ id }: CookbookPageProps) => {
  return <EditCookbookCell id={id} />
}

export default EditCookbookPage
