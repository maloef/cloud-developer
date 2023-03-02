import * as AWS  from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'

// const XAWS = AWSXRay.captureAWS(AWS)

const s3 = new AWS.S3({
    signatureVersion: 'v4'
})

export class S3Access {

      createPresignedUrl(key: string): string {
        return s3.getSignedUrl('putObject', {
            Bucket: process.env.ATTACHMENT_S3_BUCKET,
            Key: key,
            Expires: process.env.SIGNED_URL_EXPIRATION
        })
      }
}