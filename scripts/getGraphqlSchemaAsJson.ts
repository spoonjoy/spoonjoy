import { spawn } from 'child_process'
import { inspect } from 'util'

import {
  buildSchema,
  graphqlSync,
  IntrospectionQuery,
  getIntrospectionQuery,
} from 'graphql'
import {
  fromIntrospectionQuery,
  FromIntrospectionQueryOptions,
} from 'graphql-2-json-schema'

const nativeScalarsToFilter = ['String', 'Int', 'Boolean']

const inputSDL = `
  input CreateStepOutputUseInput {
    "The step who's output is being used"
    outputOfStepNum: Int!
    "The step who's doing the using. Can be left out if creating steps output uses at the same time as the recipeSteps"
    inputOfStepNum: Int
  }

  input CreateIngredientInput {
    quantity: Float!
    unitName: String!
    ingredientName: String!
  }

  input CreateRecipeStepInput {
    stepNum: Int!
    stepTitle: String
    description: String!
    ingredients: [CreateIngredientInput!]
    stepOutputUses: [CreateStepOutputUseInput!]
  }

  input CreateRecipeInput {
    title: String!
    description: String
    servings: Int
    steps: [CreateRecipeStepInput!]!
  }

  type Query {placeholder(id: ID!): String}
  type Mutation {createRecipe(input: CreateRecipeInput!): String}
`

const readmeSchema = buildSchema(inputSDL)
const introspectionQueryJSON = graphqlSync({
  schema: readmeSchema,
  source: getIntrospectionQuery(),
}).data as unknown as IntrospectionQuery

const options: FromIntrospectionQueryOptions = {
  // Whether or not to ignore GraphQL internals that are probably not relevant
  // to documentation generation.
  // Defaults to `true`
  ignoreInternals: true,
  // Whether or not to properly represent GraphQL Lists with Nullable elements
  // as type "array" with items being an "anyOf" that includes the possible
  // type and a "null" type.
  // Defaults to `false` for backwards compatibility, but in future versions
  // the effect of `true` is likely going to be the default and only way. It is
  // highly recommended that new implementations set this value to `true`.
  nullableArrayItems: true,
  // Indicates how to define the `ID` scalar as part of a JSON Schema. Valid options
  // are `string`, `number`, or `both`. Defaults to `string`
  idTypeMapping: 'string',
}

const readmeResult = fromIntrospectionQuery(introspectionQueryJSON, options)

// Get rid of undefined values this way
const cleanedUpReadmeResult = JSON.parse(JSON.stringify(readmeResult))

const startsWithTestGenerator = (stringToTest: string) => {
  return (stringToLookFor: string) =>
    stringToTest.startsWith(`${stringToLookFor}:`)
}

const keyComparator = (a: string, b: string) => {
  // description to the top
  if (['description'].some(startsWithTestGenerator(a))) {
    // If the other one also satisfies the test (which is impossible, but ok) then
    // there is no sort change
    return ['description'].some(startsWithTestGenerator(b)) ? 0 : -1
  }
  if (['description'].some(startsWithTestGenerator(b))) {
    return 1
  }

  // Native Scalars to the bottom
  if (nativeScalarsToFilter.some(startsWithTestGenerator(a))) {
    // If the other one also satisfies the test, then no sort change
    return nativeScalarsToFilter.some(startsWithTestGenerator(b)) ? 0 : 1
  }
  if (nativeScalarsToFilter.some(startsWithTestGenerator(b))) {
    return -1
  }

  // Stay the same
  return 0
}

const output = `### Input

\`\`\`graphql${inputSDL}\`\`\`

### Output

\`\`\`js
// Output is from call to fromIntrospectionQuery with the following options:
const options = ${inspect(options)}

${inspect(cleanedUpReadmeResult, { depth: null, sorted: keyComparator })}
\`\`\`
`

console.log(`
<BEGIN OUTPUT>
${output}
<END OUTPUT>
`)

if (process.platform === 'darwin') {
  const proc = spawn('pbcopy')
  proc.stdin.write(output)
  proc.stdin.end()
  console.log('OUTPUT COPIED TO YOUR CLIPBOARD!!!\n')
}
