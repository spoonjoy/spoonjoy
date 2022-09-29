// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  recipe: {
    id: 'testRecipeId',
    title: 'Israeli Hummus',
    description:
      "You'll seriously never have better hummus. It's very creamy and delicious!",
    servings: 5,
    chef: {
      id: 'testUserId',
      username: 'ari',
    },
    steps: [
      {
        id: 'testStepId1',
        stepNum: 1,
        ingredients: [
          {
            id: 'testIngId1',
            quantity: 1.5,
            unit: {
              name: 'cups',
            },
            ingredientRef: {
              name: 'chana dal',
            },
          },
          {
            id: 'testIngId2',
            quantity: 1,
            unit: {
              name: 'tsp',
            },
            ingredientRef: {
              name: 'baking soda',
            },
          },
        ],
        description:
          "Boil the shit out of it until it's mushy, then let it cool in the water. Soak it overnight first if you're good at planning ahead",
      },
      {
        id: 'testStepId2',
        stepNum: 2,
        ingredients: [
          {
            id: 'testIngId3',
            quantity: 0.5,
            unit: {
              name: 'tbsp',
            },
            ingredientRef: {
              name: 'salt',
            },
          },
          {
            id: 'testIngId4',
            quantity: 2,
            unit: {
              name: 'tsp',
            },
            ingredientRef: {
              name: 'granulated citric acid',
            },
          },
          {
            id: 'testIngId5',
            quantity: 3,
            unit: {
              name: 'cloves',
            },
            ingredientRef: {
              name: 'garlic',
            },
          },
        ],
        description: 'Blend in food processor',
      },
      {
        id: 'testStepId3',
        stepNum: 3,
        ingredients: [
          {
            id: 'testIngId6',
            quantity: 16,
            unit: {
              name: 'oz',
            },
            ingredientRef: {
              name: 'tahini',
            },
          },
          {
            id: 'testIngId7',
            quantity: 1,
            unit: {
              name: 'cup',
            },
            ingredientRef: {
              name: 'cold water',
            },
          },
        ],
        description: 'Add in tahini. Drizzle in cold water as needed.',
      },
    ],
    createdAt: new Date(),
    deletedAt: null,
  },
})
