import { render } from '@redwoodjs/testing/web'

import ImportRecipesPage from './ImportRecipesPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('ImportRecipesPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ImportRecipesPage />)
    }).not.toThrow()
  })
})
