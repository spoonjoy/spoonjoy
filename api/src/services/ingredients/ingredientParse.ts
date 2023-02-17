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
    // model: 'ada:ft-spoonjoy:ingredient-inputs-2023-02-17-18-15-07',
    model:
      'ada:ft-spoonjoy:ingredient-inputs-from-generated-2023-02-17-23-40-47',
    prompt: `${input} ->`,
    temperature: 0.7,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stop: ['####'],
  })

  const jsonStr = response.data.choices[0].text || '{}'

  try {
    const asJson = JSON.parse(jsonStr.replace(/'/g, '"'))
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
