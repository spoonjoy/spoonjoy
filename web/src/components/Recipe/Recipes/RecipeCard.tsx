import { RecipeShortInfo } from 'types/graphql'

import { routes } from '@redwoodjs/router'

import ListCardBase from '../../shared/ListCard/ListCardBase'

const RecipeCard = ({ recipe }: { recipe: RecipeShortInfo }) => (
  <ListCardBase
    linkTo={routes.recipe({ id: recipe.id })}
    linkTitle={'Show recipe ' + recipe.id + ' detail'}
  >
    <div
      className={`relative w-full overflow-hidden rounded-lg group-focus:ring-2 group-focus:ring-indigo-700`}
    >
      <div
        style={{
          backgroundImage: `url('${recipe.imageUrl}')`,
        }}
        className={` absolute top-0 bottom-0 left-0 right-0 bg-cover bg-bottom contrast-75 saturate-[.75] group-hover:contrast-100 group-hover:saturate-100 group-focus:contrast-100 group-focus:saturate-100`}
      />

      <div className="absolute bottom-0 flex w-full justify-center">
        <div className="mx-2 w-full">
          <div className="relative mb-2 rounded-md p-4 text-white backdrop-blur backdrop-brightness-50">
            <h3 className="text-xl font-medium text-white opacity-90">
              {recipe.title}
            </h3>
            <dl className="mt-1 flex flex-grow flex-col justify-between">
              <dd className="text-sm text-white opacity-70">
                {recipe.description}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  </ListCardBase>
)

export default RecipeCard
