import { render } from '@redwoodjs/testing/web'

import RecipeImportLoading from './RecipeImportLoading'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('RecipeImportLoading', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<RecipeImportLoading />)
    }).not.toThrow()
  })
})
