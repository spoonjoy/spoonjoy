import { render } from '@redwoodjs/testing/web'

import NewCookbookPage from './NewCookbookPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('NewCookbookPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<NewCookbookPage />)
    }).not.toThrow()
  })
})
