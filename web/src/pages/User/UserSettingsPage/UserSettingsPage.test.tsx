import { render } from '@redwoodjs/testing/web'

import UserSettingsPage from './UserSettingsPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('UserSettingsPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<UserSettingsPage />)
    }).not.toThrow()
  })
})
