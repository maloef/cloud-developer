import * as AWS  from 'aws-sdk'
import { createLogger } from '../utils/logger'
// import * as AWSXRay from 'aws-xray-sdk'

// const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('S3Access')

const s3 = new AWS.S3({
    signatureVersion: 'v4'
})

export class S3Access {

    async createPresignedUrl(key: string): Promise<string> {
        const expires = parseInt(process.env.SIGNED_URL_EXPIRATION)
        logger.info('creating presigned url for key ' + key)

        const signedUrl = await s3.getSignedUrlPromise('putObject', {
            Bucket: process.env.ATTACHMENT_S3_BUCKET,
            Key: key,
            Expires: expires
        })
        logger.info('signed url created: ' + signedUrl)

        return signedUrl
    }

    async deleteAttachment(key: string) {
        try {
            await s3.deleteObject({
              Bucket: process.env.ATTACHMENT_S3_BUCKET,
              Key: key
            }).promise()
            logger.info('deleted attachment ' + key)
        } catch (err) {
            logger.error('could not delete attachment ' + key + ": " + err)
        }
    }
}