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
    prompt: `${title}${
      description && ` - ${description}`
    }, in the style of a professionally taken photo for a cookbook.`,
  })

  const imageUrl = imageResponse.data.data[0].url

  console.log('image url:', imageResponse.data.data[0].url)

  return imageUrl
}
