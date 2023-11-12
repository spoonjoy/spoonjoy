import OpenAI from 'openai'
import { IngredientInputType, QueryResolvers } from 'types/graphql'

import { RedwoodError } from '@redwoodjs/api'

/** GPT sometimes doesn't understand that we want floats, not fractions. */
export const replaceFractionsWithFloats = (str: string): string => {
  // Define a regular expression pattern to match fractions
  const fractionPattern = /(?:(\d+)\s+)?(\d+)\/(\d+)/g

  // Replace each fraction with its equivalent float
  const result = str.replace(
    fractionPattern,
    (match, wholeNumber, numerator, denominator) => {
      const float =
        (wholeNumber ? Number(wholeNumber) : 0) +
        Number(numerator) / Number(denominator)
      return float.toString()
    }
  )

  return result
}

const ingredientCompletionToIngredientInputType = (
  str: string
): IngredientInputType => {
  const MIN_INPUT_LENGTH = 4 // this is arbitrary but i figured the smallest you could have is, eg, '1g a' (where 'a' is some ingredient name - are there any 1 letter ingredient names? feh)
  if (str.length < MIN_INPUT_LENGTH) {
    throw new RedwoodError(
      `Ingredient completion string is too short, input was: ${str}`
    )
  }

  try {
    const asJson = JSON.parse(
      replaceFractionsWithFloats(str)
    ) as IngredientInputType
    try {
      return {
        ingredientName: asJson.ingredientName || '',
        quantity: asJson.quantity || 0,
        unitName: asJson.unitName || '',
      }
    } catch {
      throw new RedwoodError(
        `Unable to parse IngredientInputType JSON from ${asJson} from input ${str}`
      )
    }
  } catch {
    throw new RedwoodError(
      `Failed to parse ingredient completion string to JSON, input was: ${str}`
    )
  }
}



const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
})

export const parseIngredient: QueryResolvers['parseIngredient'] = async ({
  input,
}) => {
  const response = await getIngredientCompletions([input])

  const jsonStr = response?.data.choices[0].text || '{}'

  return ingredientCompletionToIngredientInputType(jsonStr)
}

export const parseIngredients = async (
  ingredients: string[]
): Promise<IngredientInputType[]> => {
  const response = await getIngredientCompletions(ingredients)

  const jsonStrs =
    response?.data.choices.map((choice) => {
      return choice.text || '{}'
    }) || []

  const asJsons = jsonStrs
    .map((jsonStr) => {
      return ingredientCompletionToIngredientInputType(jsonStr)
    })
    .filter((json) => json !== undefined) as IngredientInputType[]

  return asJsons
}

export const getIngredientCompletions = async (ingredients: string[]) => {
  const prompts = ingredients.map((ingredient) => {
    return `${ingredient} ->`
  })
  try {
    return await openai.completions.create({
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
      )}. Error: ${(error as Error).message}`
    )
  }
}
