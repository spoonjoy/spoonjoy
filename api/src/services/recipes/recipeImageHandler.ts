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
  // Written by ChatGPT ;)
  const prompt = `Generate an image of ${title} professional food photography that looks as if it could be featured in a high-end cookbook. The dish should be presented on a plate with appropriate garnishes, and the overall image should have a visually pleasing composition and lighting. The dish should look delicious and appetizing.`
  const imageResponse = await openai.createImage({
    prompt,
  })

  const openaiUrl = imageResponse.data.data[0].url

  if (openaiUrl) {
    const sjUrl = uploadImageToCloudinary(openaiUrl, recipeId)
    return sjUrl
  } else {
    throw new Error("Couldn't get image from OpenAI.")
  }
}

export const uploadImageToCloudinary = async (
  imagePath: string,
  imageId: string
) => {
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
