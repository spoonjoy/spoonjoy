import type { CookbookInfo } from 'types/graphql'

import CookbookCard from './CookbookCard'

const Cookbooks = ({ cookbooks }: { cookbooks: CookbookInfo[] }) => (
  <div className="align-center flex justify-center">
    <ul className="inline-grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
      {cookbooks.map((cookbook) => (
        <CookbookCard key={cookbook.id} cookbook={cookbook} />
      ))}
    </ul>
  </div>
)

export default Cookbooks
