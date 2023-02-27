import React, { useState } from 'react'

const ImportRecipeFromPlatformPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0])
    }
  }

  const handleFileUpload = async () => {
    if (file) {
      const presignedUrl =
        'https://sj-misc.s3.us-east-1.amazonaws.com/uploads/test-upload.zip?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAR2UOPEM2KMSDJF4F%2F20230227%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20230227T021007Z&X-Amz-Expires=300&X-Amz-Signature=2099180eab5b1bb137f979c168e4ceed6785f0fa8a3e2f6c4e436dc994e641d6&X-Amz-SignedHeaders=host&x-id=PutObject'

      // Upload the file to S3
      const response = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      })

      // Handle the response
      if (response.ok) {
        console.log('File uploaded successfully!')
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
