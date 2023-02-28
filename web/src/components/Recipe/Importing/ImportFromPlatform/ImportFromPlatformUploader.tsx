import React, { useState } from 'react'

import { CloudArrowUpIcon } from '@heroicons/react/24/solid'
import axios from 'axios'
import JSZip from 'jszip'
import { ImportRecipeFromCroutonMutation } from 'types/graphql'

import { routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/dist/toast'

import { splitJSZipIntoGroups, zipToFile } from './uploaderHelpers'

const IMPORT_RECIPE_FROM_CROUTON_MUTATION = gql`
  mutation ImportRecipeFromCroutonMutation($fileKey: String!) {
    import: importRecipesFromCrouton(fileKey: $fileKey) {
      cookbookId
      importCount
      failedCount
    }
  }
`

export interface IImportFromPlatformUploaderProps {
  setShowLoading: (showLoading: boolean) => void
  setRedirectUrl: (redirectUrl: string) => void
  setBulkSuccessStats: (stats: { succeeded: number; failed: number }) => void
  setOnRetry: React.Dispatch<React.SetStateAction<() => void>>
  setError: (error: Error | undefined) => void
}
const ImportFromPlatformUploader = ({
  setShowLoading,
  setRedirectUrl,
  setBulkSuccessStats,
  setOnRetry,
  setError,
}: IImportFromPlatformUploaderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileKey, setFileKey] = useState<string | undefined>(undefined)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0])
    }
  }

  const [importRecipesFromCrouton, { data, error }] =
    useMutation<ImportRecipeFromCroutonMutation>(
      IMPORT_RECIPE_FROM_CROUTON_MUTATION,
      {
        onCompleted: (data) => {
          toast.success('recipes imported')
          setRedirectUrl(routes.cookbook({ id: data.import.cookbookId }))
          setBulkSuccessStats({
            succeeded: data.import.importCount,
            failed: data.import.failedCount,
          })
        },
        onError: (error) => {
          toast.error(error.message)
          setOnRetry(
            () => () => importRecipesFromCrouton({ variables: { fileKey } })
          )
        },
      }
    )

  setError(error)

  const handleFileUpload = async (file: File) => {
    if (file) {
      setShowLoading(true)

      const filename = file.name.replace(' ', '+')
      const presignedUrlEndpoint = `http://${window.location.host}/api/getS3UploadUrl?filename=${filename}`

      // Get the pre-signed S3 URL using Axios
      const presignedUrlResponse = await axios.get(presignedUrlEndpoint)
      const presignedUrl = presignedUrlResponse.data.data.signedUrl
      const returnedFileKey = presignedUrlResponse.data.data.fileKey
      setFileKey(returnedFileKey)

      // Create the config object with headers and body
      const options = {
        headers: { 'Content-Type': file.type },
      }

      // Upload the file to S3 using Axios
      const uploadResponse = await axios.put(presignedUrl, file, options)

      // Handle the response
      if (uploadResponse.status === 200) {
        toast.success('file uploaded successfully')
        importRecipesFromCrouton({ variables: { fileKey: returnedFileKey } })
      } else {
        toast.error('error uploading file')
      }
    }
  }

  /**
   * Verify that the file is a crouton file, and if so, return an array of files, broken up into smaller chunks (10 recipes per zip)
   * @returns null if not a crouton file, otherwise an array of files
   */
  const handleCroutonFile = async (): Promise<JSZip[] | null> => {
    try {
      if (selectedFile) {
        const croutons = await JSZip.loadAsync(selectedFile)
        const fileNames = Object.keys(croutons.files)

        if (fileNames.length === 0) {
          toast.error('file appears to be empty')
          return null
        }

        // verify that the file is a crouton file
        if (!fileNames[0].endsWith('.crumb')) {
          toast.error('not a crouton file')
          return null
        }

        toast.loading(
          'crouton file verified, found ' + fileNames.length + ' recipes'
        )

        // split the file into chunks of 10 recipes
        const chunks = await splitJSZipIntoGroups(croutons)
        return chunks
      } else {
        toast.error('no file selected')
        return null
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : (error as string)
      toast.error(message)
      return null
    }
  }

  const onSubmit = async () => {
    try {
      const timestamp = new Date().toLocaleString()
      const chunks = await handleCroutonFile()
      if (chunks) {
        chunks.forEach(async (chunk, idx) => {
          // doing non-null assertion here because we already verified that the file exists
          const file = await zipToFile(
            chunk,
            `${timestamp}/${idx}-${selectedFile!.name}`
          )
          handleFileUpload(file)
        })
      }
    } catch (error) {
      toast.error(error.message)
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
            <div className="flex flex-col items-center justify-center pt-20">
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
          onClick={onSubmit}
          disabled={!file}
        >
          import from crouton app
        </button>
      </div>
    </>
  )
}

export default ImportFromPlatformUploader
