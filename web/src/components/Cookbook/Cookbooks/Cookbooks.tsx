import type { CookbookInfo } from 'types/graphql'

import CookbookCard from './CookbookCard'

const Cookbooks = ({ cookbooks }: { cookbooks: CookbookInfo[] }) => (
  <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {cookbooks.map((cookbook) => (
      <CookbookCard key={cookbook.id} cookbook={cookbook} />
    ))}
  </ul>
)

export default Cookbooks
