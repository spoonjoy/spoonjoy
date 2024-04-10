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

const _ingredientCompletionToIngredientInputType = (
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
  /**
   * getParsedIngredientsFromGPT returns an array of IngredientInputType,
   * but we're only parsing one ingredient here, so we'll return the first.
   */
  return (await getParsedIngredientsFromGPT([input]))[0]
}

export const parseIngredients = async (
  ingredients: string[]
): Promise<IngredientInputType[]> => {
  return await getParsedIngredientsFromGPT(ingredients)
}

export const getParsedIngredientsFromGPT = async (ingredients: string[]) => {
  const prompt = `
  The following are human-readable ingredient strings.
  Parse them into an array of JSON objects to be used as an input to the returnIngredients function.
  ${ingredients.join('\n')}`
  const response = await openai.chat.completions.create({
    model: 'gpt-4-0125-preview',
    messages: [
      {
        role: 'system',
        content:
          'You are an ingredient parsing bot. Your purpose is to parse human-readable ingredient strings into JSON objects. You must be as accurate as possible and not make up any information. You must also not leave out any information. If no obvious unit is provided, you may assume the ingredient is in the most common unit for that ingredient.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    /**
     * because we always want structured data back, we can tell GPT that we're looking
     * to use its output to call a function
     * https://platform.openai.com/docs/guides/gpt/function-calling
     */
    function_call: {
      name: 'returnIngredients',
    },
    functions: [
      {
        name: 'returnIngredients',
        description: 'Returns a list of ingredients',
        parameters: {
          type: 'object',
          properties: {
            ingredients: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  quantity: {
                    type: 'number',
                    description:
                      'Quantity of the ingredient in the unit specified',
                  },
                  unitName: {
                    type: 'string',
                    description: 'Name of the unit specified',
                  },
                  ingredientName: {
                    type: 'string',
                    description: 'Name of the ingredient specified',
                  },
                },
                required: ['quantity', 'unitName', 'ingredientName'],
              },
            },
          },
          required: ['ingredients'],
        },
      },
    ],
  })

  const responseMessage = response.choices[0].message

  // confirm GPT wanted to call the function
  if (responseMessage.function_call) {
    // confirm GPT called the right function
    if (responseMessage.function_call.name === 'returnIngredients') {
      // confirm GPT returned the right data type
      const functionArgsStr = responseMessage.function_call.arguments
      const functionArgs = JSON.parse(functionArgsStr)
      const functionArgsArray =
        functionArgs.ingredients as IngredientInputType[]

      // return only the ingredients that have all the required fields
      return functionArgsArray.filter(
        (functionArg) =>
          !!functionArg.ingredientName &&
          !!functionArg.quantity &&
          !!functionArg.unitName
      )
    } else {
      throw new Error(
        `GPT returned the wrong data structure for returnIngredients, response message is ${responseMessage}`
      )
    }
  } else {
    throw new Error('GPT called the wrong function')
  }
}

export const getIngredientCompletionsOld = async (ingredients: string[]) => {
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
