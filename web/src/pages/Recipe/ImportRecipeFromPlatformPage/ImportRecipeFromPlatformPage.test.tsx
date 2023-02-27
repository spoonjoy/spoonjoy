import { render } from '@redwoodjs/testing/web'

import ImportRecipeFromPlatformPage from './ImportRecipeFromPlatformPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('ImportRecipeFromPlatformPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ImportRecipeFromPlatformPage />)
    }).not.toThrow()
  })
})
