import { CreateRecipeInput } from 'types/graphql'

export const recipeMutationInputIngsOnly: { input: CreateRecipeInput } = {
  input: {
    title: 'Pizza!',
    description: "The yummiest pizza you've ever had.",
    servings: 2,
    steps: [
      {
        stepNum: 1,
        description: 'first step!',
        ingredients: [
          {
            quantity: 1.5,
            unitName: 'pounds',
            ingredientName: 'cheese',
          },
          {
            quantity: 2,
            unitName: 'gallons',
            ingredientName: 'tomato sauce',
          },
        ],
      },
      {
        stepNum: 2,
        description: 'we love pie',
        ingredients: [
          {
            quantity: 1.0,
            unitName: 'stick',
            ingredientName: 'butter',
          },
          {
            quantity: 19,
            unitName: 'loaf',
            ingredientName: 'toast',
          },
        ],
      },
    ],
  },
}

export const recipeMutationInputWrongStepNums: { input: CreateRecipeInput } = {
  input: {
    title: 'Pizza!',
    description: "The yummiest pizza you've ever had.",
    servings: 2,
    steps: [
      {
        stepNum: 1,
        description: 'first step!',
        ingredients: [
          {
            quantity: 1.5,
            unitName: 'pounds',
            ingredientName: 'cheese',
          },
          {
            quantity: 2,
            unitName: 'gallons',
            ingredientName: 'tomato sauce',
          },
        ],
      },
      {
        stepNum: 3,
        description: 'another step',
        ingredients: [
          {
            quantity: 1.0,
            unitName: 'stick',
            ingredientName: 'butter',
          },
          {
            quantity: 19,
            unitName: 'loaf',
            ingredientName: 'toast',
          },
        ],
      },
    ],
  },
}

export const recipeMutationInputNoIngOrStepUses: { input: CreateRecipeInput } =
  {
    input: {
      title: 'French Toast!',
      description: 'Fruit salad, yummy yummy',
      servings: 2,
      steps: [
        {
          stepNum: 1,
          description: 'first step!',
        },
        {
          stepNum: 2,
          description: 'i really gotta pee',
        },
      ],
    },
  }
