import { render } from '@redwoodjs/testing/web'

import IngredientsItemsList from './IngredientsItemsList'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('IngredientsItemsList', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<IngredientsItemsList />)
    }).not.toThrow()
  })
})
