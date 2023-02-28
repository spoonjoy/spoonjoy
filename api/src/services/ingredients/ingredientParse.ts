import { Configuration, OpenAIApi } from 'openai'
import {
  CreateIngredientInput,
  IngredientParse,
  QueryResolvers,
} from 'types/graphql'

import { RedwoodGraphQLError } from '@redwoodjs/graphql-server'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
})

const openai = new OpenAIApi(configuration)

export const parseIngredient: QueryResolvers['parseIngredient'] = async ({
  input,
}) => {
  const response = await getIngredientCompletions([input])

  const jsonStr = response?.data.choices[0].text || '{}'

  try {
    const asJson = JSON.parse(jsonStr)
    try {
      return {
        ingredientName: asJson.ingredientName || '',
        quantity: asJson.quantity || 0,
        unitName: asJson.unitName || '',
        rawJsonReturned: JSON.stringify(jsonStr),
      } as IngredientParse
    } catch (error) {
      throw new RedwoodGraphQLError(
        `Couldn't parse input ${input}, got ${asJson}`
      )
    }
  } catch {
    return {
      rawJsonReturned: jsonStr,
    }
  }
}

export const parseIngredients = async (
  ingredients: string[]
): Promise<CreateIngredientInput[]> => {
  const response = await getIngredientCompletions(ingredients)

  const jsonStrs =
    response?.data.choices.map((choice) => {
      return choice.text || '{}'
    }) || []

  const asJsons = jsonStrs
    .map((jsonStr) => {
      try {
        const asJson = JSON.parse(jsonStr)
        return asJson as CreateIngredientInput
      } catch {
        console.error(
          `Couldn't parse ingredient output ${JSON.stringify(jsonStr)}`
        )
      }
    })
    .filter((json) => json !== undefined) as CreateIngredientInput[]

  return asJsons
}

export const getIngredientCompletions = async (ingredients: string[]) => {
  const prompts = ingredients.map((ingredient) => {
    return `${ingredient} ->`
  })
  try {
    return await openai.createCompletion({
      // This model is slightly more reliable but way more expensive
      // model: 'davinci:ft-spoonjoy:ingredient-inputs-2023-02-18-16-21-57',
      model:
        'curie:ft-spoonjoy:ingredient-inputs-low-epochs-2023-02-18-17-54-03',
      prompt: prompts,
      temperature: 0,
      max_tokens: 400,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop: ['####'],
    })
  } catch (error) {
    console.error(
      `Couldn't get completion for ingredients ${JSON.stringify(
        ingredients
      )}. Error: ${error.message}`
    )
  }
}
