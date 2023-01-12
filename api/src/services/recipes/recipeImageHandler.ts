import { v2 as cloudinary } from 'cloudinary'
import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
})

const openai = new OpenAIApi(configuration)

cloudinary.config({
  secure: true,
})

export const createRecipeImage = async (
  title: string,
  description: string | null | undefined
) => {
  const imageResponse = await openai.createImage({
    prompt: `${title}${
      description && ` - ${description}`
    }, in the style of a professionally taken photo for a cookbook.`,
  })

  const openaiUrl = imageResponse.data.data[0].url

  if (openaiUrl) {
    const sjUrl = uploadImageToCloudinary(openaiUrl)
    return sjUrl
  } else {
    throw new Error("Couldn't get image from OpenAI.")
  }
}

const uploadImageToCloudinary = async (imagePath: string) => {
  // Use the uploaded file's name as the asset's public ID and
  // allow overwriting the asset with new versions
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  }

  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(imagePath, options)
    console.log(result)
    return result.secure_url
  } catch (error) {
    console.error(error)
  }
}
