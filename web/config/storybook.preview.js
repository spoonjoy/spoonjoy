import React from 'react'
import { store, StoreProvider } from '../src/stores/RootStore'

export const decorators = [
  (Story) => {
    return (
      <StoreProvider value={store}>
        <Story />
      </StoreProvider>
    )
  },
]
