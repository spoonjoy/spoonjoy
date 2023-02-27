import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { Extract } from 'unzipper'

const REGION = 'us-east-1'
const BUCKET = 'sj-misc'

const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || '',
    secretAccessKey: process.env.S3_SECRET_KEY || '',
  },
})

export const getSignedUploadUrl = async (fileKey: string) => {
  const bucketParams = {
    Bucket: BUCKET,
    Key: fileKey,
  }
  // Create a command to put the object in the S3 bucket.
  const command = new PutObjectCommand(bucketParams)

  // Create a presigned URL for the command.
  return getSignedUrl(s3, command, {
    expiresIn: 60 * 5, // 5 minutes
  })
}

export const downloadFileFromS3 = async (fileKey: string) => {
  const bucketParams = {
    Bucket: BUCKET,
    Key: fileKey,
  }

  const response = await s3.send(new GetObjectCommand(bucketParams))

  const buffer = (await response.Body!.transformToByteArray()).buffer

  return buffer
}
