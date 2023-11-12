import OpenAI from 'openai'
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

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
})

const recipeInputSchema =
  '{"$schema":"http://json-schema.org/draft-06/schema#","type":"object","title":"The CreateRecipeInput Schema","properties":{"input":{"$ref":"#/definitions/CreateRecipeInput"}},"definitions":{"CreateRecipeInput":{"type":"object","properties":{"description":{"$ref":"#/definitions/String"},"title":{"$ref":"#/definitions/String"},"servings":{"$ref":"#/definitions/Int"},"steps":{"type":"array","items":{"$ref":"#/definitions/CreateRecipeStepInput"}}},"required":["title","steps"]},"CreateStepOutputUseInput":{"type":"object","properties":{"outputOfStepNum":{"description":"If you\'re using the output of another step, include that here","$ref":"#/definitions/Int"},"inputOfStepNum":{"description":"The step in which you are using the output of another step","$ref":"#/definitions/Int"}},"required":["outputOfStepNum"]},"CreateIngredientInput":{"type":"object","properties":{"quantity":{"$ref":"#/definitions/Float"},"unitName":{"$ref":"#/definitions/String"},"ingredientName":{"$ref":"#/definitions/String"}},"required":["quantity","unitName","ingredientName"]},"Float":{"type":"number","title":"Float"},"CreateRecipeStepInput":{"type":"object","properties":{"description":{"$ref":"#/definitions/String"},"stepNum":{"$ref":"#/definitions/Int"},"stepTitle":{"$ref":"#/definitions/String"},"ingredients":{"type":"array","items":{"$ref":"#/definitions/CreateIngredientInput"}},"stepOutputUses":{"type":"array","items":{"$ref":"#/definitions/CreateStepOutputUseInput"}}},"required":["stepNum","description"]},"ID":{"type":"string","title":"ID"},"Int":{"type":"number","title":"Int"},"String":{"type":"string","title":"String"},"Boolean":{"type":"boolean","title":"Boolean"}}}'

export const convertRecipeHtmlToInputUsingOpenAi = (html: string) => {
  const prompt = `Given the provided HTML, please perform the following tasks:

  1. Carefully analyze the HTML to identify one or more recipes.
  2. For every recipe found:
     a. Extract all ingredients and instructions in the order they will be used.
     b. Make sure no ingredient or instruction is omitted.

  HTML: ${html}
  Schema: ${recipeInputSchema}

  Now, please generate a valid JSON object containing the extracted recipe information based on these rules:

  1. Must adhere to the given JSON schema.
  2. Incorporate all recipes found in the HTML, inline.
  3. Use singular units for all measurements.
  4. Abbreviate ingredient names and units where possible, e.g., 'tbsp', 'oz', 'ap flour'.
  5. For each step, do the following:
    a. Include all available detailed information without leaving any part out.
    b. Include at least one ingredient or reference the output of a previous step by attaching its stepNum as outputOfStepNum (where inputOfStepNum is the current step using the output of that previous step). A step can only reference a previous step, not a subsequent one.
    c. Determine appropriate step titles and step output uses.

  Make sure your output is a complete, coherent, and valid JSON object that strictly follows the given JSON schema and fully incorporates all extracted recipe information without excluding any ingredient or instruction.
  Do your best to come up with a short, descriptive name for each step.`

  try {
    console.log('started getting completion...', getCurrentTimeString())
    return openai.chat.completions
      .create({
        model: 'gpt-4-1106-preview',
        messages: [
          {
            role: 'system',
            content:
              'You are a recipe import bot. Your purpose is to parse the HTML of a recipe and return it in the required JSON format You must be as accurate as possible and not make up any information. You must also not leave out any information.',
          },
          { role: 'user', content: prompt },
        ],
        /**
         * because we always want structured data back, we can tell GPT that we're looking
         * to use its output to call a function
         * https://platform.openai.com/docs/guides/gpt/function-calling
         */
        function_call: {
          name: 'returnRecipeInput',
        },
        functions: [
          {
            name: 'returnRecipeInput',
            parameters: {
              type: 'object',
              title: 'The CreateRecipeInput Schema',
              properties: {
                input: { $ref: '#/definitions/CreateRecipeInput' },
              },
              definitions: {
                CreateRecipeInput: {
                  type: 'object',
                  properties: {
                    description: { $ref: '#/definitions/String' },
                    title: { $ref: '#/definitions/String' },
                    servings: { $ref: '#/definitions/Int' },
                    steps: {
                      type: 'array',
                      items: { $ref: '#/definitions/CreateRecipeStepInput' },
                    },
                  },
                  required: ['title', 'steps'],
                },
                CreateStepOutputUseInput: {
                  type: 'object',
                  properties: {
                    outputOfStepNum: {
                      description:
                        "If you're using the output of another step, include that here",
                      $ref: '#/definitions/Int',
                    },
                    inputOfStepNum: {
                      description:
                        'The step in which you are using the output of another step',
                      $ref: '#/definitions/Int',
                    },
                  },
                  required: ['outputOfStepNum'],
                },
                CreateIngredientInput: {
                  type: 'object',
                  properties: {
                    quantity: { $ref: '#/definitions/Float' },
                    unitName: { $ref: '#/definitions/String' },
                    ingredientName: { $ref: '#/definitions/String' },
                  },
                  required: ['quantity', 'unitName', 'ingredientName'],
                },
                Float: { type: 'number', title: 'Float' },
                CreateRecipeStepInput: {
                  type: 'object',
                  properties: {
                    description: { $ref: '#/definitions/String' },
                    stepNum: { $ref: '#/definitions/Int' },
                    stepTitle: { $ref: '#/definitions/String' },
                    ingredients: {
                      type: 'array',
                      items: { $ref: '#/definitions/CreateIngredientInput' },
                    },
                    stepOutputUses: {
                      type: 'array',
                      items: { $ref: '#/definitions/CreateStepOutputUseInput' },
                    },
                  },
                  required: ['stepNum', 'description'],
                },
                ID: { type: 'string', title: 'ID' },
                Int: { type: 'number', title: 'Int' },
                String: { type: 'string', title: 'String' },
                Boolean: { type: 'boolean', title: 'Boolean' },
              },
            },
          },
        ],
      })
      .then((res) => {
        console.log('finished getting completion!', getCurrentTimeString())
        const responseText = res.choices[0].message.function_call?.arguments
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
