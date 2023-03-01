import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify, decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import Axios from 'axios'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'
import { certToPem } from '../../utils/certToPem'

const logger = createLogger('auth')

// DONE: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
const jwksUrl = 'https://dev-b5l8pxg7z3snujdy.us.auth0.com/.well-known/jwks.json'

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  logger.info("token:", token)
  // const jwt: Jwt = decode(token, { complete: true }) as Jwt

  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  // jwt.
  const auth0Key = await retrieveAuth0Key()
  logger.info("auth0Key:", auth0Key)

  return verify(token, auth0Key, { algorithms: ['RS256'] }) as JwtPayload
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}

const x5c = `MIIDHTCCAgWgAwIBAgIJW6MbAXfSSlqmMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNVBAMTIWRldi1iNWw4cHhnN3ozc251amR5LnVzLmF1dGgwLmNvbTAeFw0yMzAyMjcxNjM2MjZaFw0zNjExMDUxNjM2MjZaMCwxKjAoBgNVBAMTIWRldi1iNWw4cHhnN3ozc251amR5LnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBANZ2EN1HuJJIXjTVQsjWBBn3ZnBTnxM588whOPvprC0b6FFX6WyU+QdXEXWBm1egSFpKQgMq3T7EPIvXLd8fPUBNJUUvQcBYypE9cMgOGuFScmVCEQVxFtexSe7iZkS1tntjFtmHFq/Y+akHOKxQqJDMB+asCtVQ1CMaZ+pVNwghn/EnSgpgwJYtIeef4fllNKFPmpy7hK0dokS7JavfWr/VvJHd4TVfAQ9JC8uV2Zb4yHHjB233C383xX9XsCQlyLgXMQkmkDWDCnux2vz+nmVsrjME3bDWT7plGEsS35H+7zRJRFVv5RKHtZC+EZrrnFs2qE+WmTQQmm8+TygwepkCAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUSrTr6sECtyUviT8lXtofseZnyYgwDgYDVR0PAQH/BAQDAgKEMA0GCSqGSIb3DQEBCwUAA4IBAQA+IT3uvquT7pxR/81G5DmGh+gHfB46+VaqLMw1We+Mid+c+VrTMrC1FJF0zFFtZQGwal7T2KledJPJxKmeTWn8AYyzxI8d8+fezVXp8sh5WfwNiY1CJapAA/xZ8FF26XtBaEOXorDidgwqVVQiE7XXL+18hWGsDVyDVUrZs7xZLL3UEx5Yyp2XZgtSEOIctKQP/eJk07Qy7/nYlV45tWS5Kv2pVDxK9KvUO069umQPARqhDPxEB3SyPNY+iD0w0fDF2d4RPOgG9MH1tBmLz5kljNaoGBkwoW5rdbXkaOlvcN5ohq2dBgPBpxCsJ7ibUL6dBVz16nWbRzlDQ1w0uv6a`

async function retrieveAuth0Key(): Promise<string> {
  const pem = certToPem(x5c)
  logger.info("pem:", pem)
  
  return pem
}
