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

  try {
    const imageResponse = await openai.createImage({
      prompt,
    })

    const openaiUrl = imageResponse.data.data[0].url

    if (openaiUrl) {
      const sjUrl = uploadFileToCloudinary(openaiUrl, recipeId)
      return sjUrl
    } else {
      throw new Error(
        `Couldn't get image from OpenAI for recipe ${title}. Got following response: ${imageResponse}`
      )
    }
  } catch (e) {
    throw new Error(
      `Couldn't get image from OpenAI for recipe ${title}. Error: ${e}`
    )
  }
}

export const uploadFileToCloudinary = async (
  /** This can be:
   * - a local file path
   * - a remote URL
   * - the data URI, base64-encoded
   * (etc. - see more here: https://cloudinary.com/documentation/image_upload_api_reference#upload_required_parameters)
   */
  file: string,
  fileId: string,
  resourceType: 'image' | 'video' | 'raw' | 'auto' = 'image'
) => {
  // Use the uploaded file's name as the asset's public ID and
  // allow overwriting the asset with new versions
  const options: CloudinaryOptions = {
    public_id: fileId,
    invalidate: true,
    resource_type: resourceType,
  }

  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(file, options)
    console.log(result)
    return result.secure_url
  } catch (error) {
    console.error(error)
  }
}
