import { render } from '@redwoodjs/testing/web'

import FellowChefsPage from './FellowChefsPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('FellowChefsPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<FellowChefsPage />)
    }).not.toThrow()
  })
})
