import CookbookCell from 'src/components/Cookbook/CookbookCell'

type CookbookPageProps = {
  id: string
}

const CookbookPage = ({ id }: CookbookPageProps) => {
  return <CookbookCell id={id} />
}

export default CookbookPage
