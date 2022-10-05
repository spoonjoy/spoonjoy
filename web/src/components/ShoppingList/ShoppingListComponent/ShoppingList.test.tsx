import { render } from '@redwoodjs/testing/web'

import ShoppingList from './ShoppingList'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ShoppingList', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ShoppingList />)
    }).not.toThrow()
  })
})
