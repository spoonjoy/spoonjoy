import React, { useState } from 'react'

import { CloudArrowUpIcon } from '@heroicons/react/24/solid'
import axios from 'axios'
import { ImportRecipeFromCroutonMutation } from 'types/graphql'

import { FileField } from '@redwoodjs/forms'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/dist/toast'

const IMPORT_RECIPE_FROM_CROUTON_MUTATION = gql`
  mutation ImportRecipeFromCroutonMutation($fileKey: String!) {
    import: importRecipesFromCrouton(fileKey: $fileKey) {
      cookbookId
    }
  }
`

interface IImportFromPlatformUploaderProps {
  setShowLoading: (showLoading: boolean) => void
  setRedirectUrl: (redirectUrl: string) => void
  setOnRetry: React.Dispatch<React.SetStateAction<() => void>>
  setError: (error: Error | undefined) => void
}
const ImportFromPlatformUploader = ({
  setShowLoading,
  setRedirectUrl,
  setOnRetry,
  setError,
}: IImportFromPlatformUploaderProps) => {
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
    <>
      <div className="m-auto mt-10 flex max-w-sm flex-col gap-5">
        <div className="flex w-full items-center justify-center">
          <label
            htmlFor="dropzone-file"
            className="flex h-64 w-full cursor-pointer flex-col items-center justify-between rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center pt-16">
              <CloudArrowUpIcon className="mb-2 h-10 text-gray-500" />
              {file ? (
                <p className="mb-10 text-sm font-semibold text-gray-500">
                  {file.name}
                </p>
              ) : (
                <>
                  <p className="mb-10 text-sm text-gray-500">
                    <span className="font-semibold">click to select</span>
                    {/* or drag and drop */}
                  </p>
                </>
              )}
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              accept=".zip"
              onChange={handleFileChange}
            />
            <p className="mb-5 text-xs text-gray-500">
              .zip file exported from crouton
            </p>
          </label>
        </div>
        <button
          className="btn-submit-primary w-full"
          onClick={handleFileUpload}
          disabled={!file}
        >
          import from crouton app
        </button>
      </div>
    </>
  )
}

export default ImportFromPlatformUploader
