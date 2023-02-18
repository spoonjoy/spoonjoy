import { Configuration, OpenAIApi } from 'openai'
import { IngredientParse, QueryResolvers } from 'types/graphql'

import { RedwoodGraphQLError } from '@redwoodjs/graphql-server'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
})

const openai = new OpenAIApi(configuration)

export const parseIngredient: QueryResolvers['parseIngredient'] = async ({
  input,
}) => {
  const response = await openai.createCompletion({
    // This model is slightly more reliable but way more expensive
    // model: 'davinci:ft-spoonjoy:ingredient-inputs-2023-02-18-16-21-57',
    model: 'curie:ft-spoonjoy:ingredient-inputs-low-epochs-2023-02-18-17-54-03',
    prompt: `${input} ->`,
    temperature: 0,
    max_tokens: 100,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stop: ['####'],
  })

  const jsonStr = response.data.choices[0].text || '{}'

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
