import {
  UploadApiOptions as CloudinaryOptions,
  v2 as cloudinary,
} from 'cloudinary'
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
  description: string | null | undefined,
  recipeId: string
) => {
  const imageResponse = await openai.createImage({
    prompt: `${title}${
      description && ` - ${description}`
    } - professional food photography.`,
  })

  const openaiUrl = imageResponse.data.data[0].url

  if (openaiUrl) {
    const sjUrl = uploadImageToCloudinary(openaiUrl, recipeId)
    return sjUrl
  } else {
    throw new Error("Couldn't get image from OpenAI.")
  }
}

const uploadImageToCloudinary = async (imagePath: string, imageId: string) => {
  // Use the uploaded file's name as the asset's public ID and
  // allow overwriting the asset with new versions
  const options: CloudinaryOptions = {
    public_id: imageId,
    invalidate: true,
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
