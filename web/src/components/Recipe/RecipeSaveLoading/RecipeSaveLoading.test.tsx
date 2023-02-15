import { render } from '@redwoodjs/testing/web'

import RecipeSaveLoading from './RecipeSaveLoading'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('RecipeSaveLoading', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<RecipeSaveLoading />)
    }).not.toThrow()
  })
})
