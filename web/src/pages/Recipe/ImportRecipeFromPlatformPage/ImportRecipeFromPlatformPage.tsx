import React, { useState } from 'react'

import axios from 'axios'

const ImportRecipeFromPlatformPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0])
    }
  }

  const handleFileUpload = async () => {
    if (file) {
      const filename = file.name.replace(' ', '+')
      const presignedUrlEndpoint = `http://${window.location.host}/api/getS3UploadUrl?filename=${filename}`

      // Get the pre-signed S3 URL using Axios
      const presignedUrlResponse = await axios.get(presignedUrlEndpoint)
      const presignedUrl = presignedUrlResponse.data.data.signedUrl
      const fileUrl = presignedUrlResponse.data.data.fileUrl

      // Create the config object with headers and body
      const config = {
        headers: { 'Content-Type': file.type },
        data: file,
      }

      // Upload the file to S3 using Axios
      const uploadResponse = await axios.put(presignedUrl, config)

      // Handle the response
      if (uploadResponse.status === 200) {
        console.log('File uploaded successfully! Get it from', fileUrl)
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
