import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
})

const openai = new OpenAIApi(configuration)

export const createRecipeImage = async (
  title: string,
  description: string | null
) => {
  const imageResponse = await openai.createImage({
    prompt: `${title}${description && ` - ${description}`}`,
  })

  return imageResponse.data.data[0].url
}
