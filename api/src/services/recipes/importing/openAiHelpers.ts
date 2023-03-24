import { Configuration, OpenAIApi } from 'openai'
import { CreateRecipeInput } from 'types/graphql'

import { RedwoodError } from '@redwoodjs/api'

import { replaceFractionsWithFloats } from 'src/services/ingredients/ingredientParse'

const getCurrentTimeString = () => {
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  const seconds = now.getSeconds().toString().padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
})

const openai = new OpenAIApi(configuration)

const recipeInputSchema =
  '{"$schema":"http://json-schema.org/draft-06/schema#","type":"object","title":"The CreateRecipeInput Schema","properties":{"input":{"$ref":"#/definitions/CreateRecipeInput"}},"definitions":{"CreateRecipeInput":{"type":"object","properties":{"description":{"$ref":"#/definitions/String"},"title":{"$ref":"#/definitions/String"},"servings":{"$ref":"#/definitions/Int"},"steps":{"type":"array","items":{"$ref":"#/definitions/CreateRecipeStepInput"}}},"required":["title","steps"]},"CreateStepOutputUseInput":{"type":"object","properties":{"outputOfStepNum":{"description":"If you\'re using the output of another step, include that here","$ref":"#/definitions/Int"},"inputOfStepNum":{"description":"The step in which you are using the output of another step","$ref":"#/definitions/Int"}},"required":["outputOfStepNum"]},"CreateIngredientInput":{"type":"object","properties":{"quantity":{"$ref":"#/definitions/Float"},"unitName":{"$ref":"#/definitions/String"},"ingredientName":{"$ref":"#/definitions/String"}},"required":["quantity","unitName","ingredientName"]},"Float":{"type":"number","title":"Float"},"CreateRecipeStepInput":{"type":"object","properties":{"description":{"$ref":"#/definitions/String"},"stepNum":{"$ref":"#/definitions/Int"},"stepTitle":{"$ref":"#/definitions/String"},"ingredients":{"type":"array","items":{"$ref":"#/definitions/CreateIngredientInput"}},"stepOutputUses":{"type":"array","items":{"$ref":"#/definitions/CreateStepOutputUseInput"}}},"required":["stepNum","description"]},"ID":{"type":"string","title":"ID"},"Int":{"type":"number","title":"Int"},"String":{"type":"string","title":"String"},"Boolean":{"type":"boolean","title":"Boolean"}}}'

export const convertRecipeHtmlToInputUsingOpenAi = (html: string) => {
  const prompt = `Given the following HTML that contains at least one recipe and the provided JSON schema, extract and return the recipe information in a valid JSON format that adheres to the schema. Combine the ingredients and instructions from all recipes, ensuring that they are in the proper order and that all ingredients are included and used.

  HTML:

  ${html}

  JSON Schema:

  ${recipeInputSchema}

  Please parse the provided HTML and return a fully valid JSON object containing the recipe information, conforming to the given JSON schema. Only return JSON. If the HTML includes multiple recipes, include them all inline. You must include ALL steps and ALL ingredients present in the HTML. You cannot combine steps. Never leave out a single step or ingredient. NEVER write anything like 'recipe follows'. For step titles, guess based on the content of the step. Also guess step output uses, where inputOfStepNum must be the same as the stepNum to which it is attached. All units should be singular, never plural. Where possible, abbreviate ingredient names and units, for example 'tablespoon' should be 'tbsp', 'ounce' should be 'oz' and 'unbleached all purpose flour' should be 'ap flour'.`

  try {
    console.log('started getting completion...', getCurrentTimeString())
    return openai
      .createChatCompletion({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
      })
      .then((res) => {
        console.log('finished getting completion!', getCurrentTimeString())
        const responseText = res.data.choices[0].message?.content
        if (!responseText)
          throw new RedwoodError(
            `No response text for recipe html ${html}, got ${res}`
          )

        const forParsing = replaceFractionsWithFloats(responseText)
        try {
          return JSON.parse(forParsing).input as CreateRecipeInput
        } catch {
          throw new RedwoodError(
            `Couldn't parse JSON, input was: ${forParsing}`
          )
        }
      })
      .catch((error) => {
        throw new RedwoodError(
          `Couldn't get completion for recipe html ${html}. Error: ${error.message}`
        )
      })
  } catch (error) {
    throw new RedwoodError(
      `Couldn't get completion for recipe html ${html}. Error: ${error.message}`
    )
  }
}
