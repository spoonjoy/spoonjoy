import { render } from '@redwoodjs/testing/web'

import FloatingNav from './FloatingNav'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('FloatingNav', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<FloatingNav />)
    }).not.toThrow()
  })
})
