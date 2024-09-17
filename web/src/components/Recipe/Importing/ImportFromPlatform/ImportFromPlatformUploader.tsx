import React, { useState } from 'react'

import { CloudArrowUpIcon } from '@heroicons/react/24/solid'
import axios from 'axios'
import JSZip from 'jszip'
import { ImportRecipeFromCroutonMutation } from 'types/graphql'

import { Redirect, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'

import {
  getFormattedDateString,
  splitJSZipIntoGroups,
  zipToFile,
} from './uploaderHelpers'

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
  bulkSuccessStats:
    | {
        succeeded: number
        failed: number
        total: number
      }
    | undefined
  setBulkSuccessStats: (stats: {
    succeeded: number
    failed: number
    total: number
  }) => void
  setOnRetry: React.Dispatch<React.SetStateAction<() => void>>
  setError: (error: Error | undefined) => void
}
const ImportFromPlatformUploader = ({
  setShowLoading,
  setRedirectUrl,
  bulkSuccessStats,
  setBulkSuccessStats,
  setOnRetry,
  setError,
}: IImportFromPlatformUploaderProps) => {
  const { currentUser, getToken } = useAuth()

  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const [numRecipes, setNumRecipes] = useState<number | undefined>(undefined)
  const [cookbookId, setCookbookId] = useState<string | undefined>(undefined)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0])
    }
  }

  if (bulkSuccessStats && bulkSuccessStats.total > 0 && cookbookId) {
    if (
      bulkSuccessStats.failed + bulkSuccessStats.succeeded ===
      bulkSuccessStats.total
    ) {
      setRedirectUrl(routes.cookbook({ id: cookbookId }))
    }
  }

  const [importRecipesFromCrouton] =
    useMutation<ImportRecipeFromCroutonMutation>(
      IMPORT_RECIPE_FROM_CROUTON_MUTATION,
      {
        onCompleted: (data) => {
          if (bulkSuccessStats) {
            setBulkSuccessStats({
              succeeded: bulkSuccessStats.succeeded + data.import.importCount,
              failed: bulkSuccessStats.failed + data.import.failedCount,
              total: numRecipes || bulkSuccessStats.total,
            })
          } else {
            setBulkSuccessStats({
              succeeded: data.import.importCount,
              failed: data.import.failedCount,
              total:
                numRecipes || data.import.importCount + data.import.failedCount,
            })
          }
          setCookbookId(data.import.cookbookId)
        },
        onError: (error) => {
          setError(error)
          toast.error(error.message)
          setOnRetry(() => () => {
            setShowLoading(false)
            setError(undefined)
          })
        },
      }
    )

  const handleFileUpload = async (
    file: File,
    onUploadSuccess: (fileKey: string) => Promise<void>
  ) => {
    if (file) {
      setShowLoading(true)
      setBulkSuccessStats({
        succeeded: 0,
        failed: 0,
        total: numRecipes || 0,
      })

      // we're already checking that currentUser exists
      const filename = `${currentUser!.username}/${file.name}`.replace(' ', '+')
      const isLocalhost = window.location.host.includes('local')
      const siteUrl = isLocalhost
        ? 'https://local.spoonjoy.app:8910'
        : 'https://spoonjoy.app'
      const presignedUrlEndpoint = `${siteUrl}/api/getS3UploadUrl?filename=${filename}`

      const currentUserToken = await getToken()

      // Get the pre-signed S3 URL using Axios
      const presignedUrlResponse = await axios.get(presignedUrlEndpoint, {
        headers: {
          Authorization: `Bearer ${currentUserToken}`,
          'auth-provider': 'dbAuth',
          'Content-Type': 'application/json',
        },
      })
      const presignedUrl = presignedUrlResponse.data.data.signedUrl
      const returnedFileKey = presignedUrlResponse.data.data.fileKey

      // Create the config object with headers and body
      const options = {
        headers: { 'Content-Type': file.type },
      }

      // Upload the file to S3 using Axios
      try {
        const uploadResponse = await axios.put(presignedUrl, file, options)
        // Handle the response
        if (uploadResponse.status === 200) {
          // toast.success('file uploaded successfully')
          await onUploadSuccess(returnedFileKey)
        } else {
          const errorMessage = `error uploading file, status code: ${uploadResponse.status}`
          toast.error(errorMessage)
          setError(new Error(errorMessage))
        }
      } catch (error) {
        toast.error(error.message)
        setError(error)
      }
    }
  }

  /**
   * Verify that the file is a crouton file, and if so, return an array of files, broken up into smaller chunks
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

        setNumRecipes(fileNames.length)

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
      const timestamp = getFormattedDateString()
      const chunks = await handleCroutonFile()
      if (chunks) {
        chunks.forEach(async (chunk, idx) => {
          // doing non-null assertion here because we already verified that the file exists
          const file = await zipToFile(
            chunk,
            `${timestamp}/${idx}-${selectedFile!.name}`
          )
          await handleFileUpload(file, onUploadSuccess)
        })
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : (error as string)
      toast.error(errorMessage)
    }
  }

  const onUploadSuccess = async (fileKey: string) => {
    try {
      await importRecipesFromCrouton({
        variables: { fileKey },
      })
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : (error as string)
      toast.error(errorMessage)
    }
  }

  if (!currentUser) {
    return <Redirect to={routes.login()} />
  } else {
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
                {selectedFile ? (
                  <p className="mb-10 text-sm font-semibold text-gray-500">
                    {selectedFile.name}
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
            disabled={!selectedFile}
          >
            import from crouton app
          </button>
        </div>
      </>
    )
  }
}

export default ImportFromPlatformUploader
