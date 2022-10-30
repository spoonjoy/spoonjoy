import React from 'react'

import { SlotProvider } from 'react-view-slot'

import { store, StoreProvider } from '../src/stores/RootStore'

export const decorators = [
  (Story) => {
    return (
      <StoreProvider value={store}>
        <SlotProvider>
          <Story />
        </SlotProvider>
      </StoreProvider>
    )
  },
]
