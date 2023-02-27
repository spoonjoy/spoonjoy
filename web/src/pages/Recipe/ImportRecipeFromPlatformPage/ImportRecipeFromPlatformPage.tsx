import React, { useState } from 'react'

import axios from 'axios'
import { ImportRecipeFromCroutonMutation } from 'types/graphql'

import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/dist/toast'

const IMPORT_RECIPE_FROM_CROUTON_MUTATION = gql`
  mutation ImportRecipeFromCroutonMutation($fileKey: String!) {
    import: importRecipesFromCrouton(fileKey: $fileKey) {
      cookbookId
    }
  }
`

const ImportRecipeFromPlatformPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0])
    }
  }

  const [importRecipesFromCrouton, { error }] =
    useMutation<ImportRecipeFromCroutonMutation>(
      IMPORT_RECIPE_FROM_CROUTON_MUTATION,
      {
        onCompleted: (data) => {
          toast.success('recipes imported')
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )

  const handleFileUpload = async () => {
    if (file) {
      const filename = file.name.replace(' ', '+')
      const presignedUrlEndpoint = `http://${window.location.host}/api/getS3UploadUrl?filename=${filename}`

      // Get the pre-signed S3 URL using Axios
      const presignedUrlResponse = await axios.get(presignedUrlEndpoint)
      const presignedUrl = presignedUrlResponse.data.data.signedUrl
      const fileKey = presignedUrlResponse.data.data.fileKey

      // Create the config object with headers and body
      const options = {
        headers: { 'Content-Type': file.type },
      }

      // Upload the file to S3 using Axios
      const uploadResponse = await axios.put(presignedUrl, file, options)

      // Handle the response
      if (uploadResponse.status === 200) {
        console.log('File uploaded successfully!')
        importRecipesFromCrouton({ variables: { fileKey } })
      } else {
        console.log('Error uploading file')
      }
    }
  }

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload</button>
    </div>
  )
}

export default ImportRecipeFromPlatformPage
