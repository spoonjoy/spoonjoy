import { render } from '@redwoodjs/testing/web'

import ShoppingListPage from './ShoppingListPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('ShoppingListPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ShoppingListPage />)
    }).not.toThrow()
  })
})
