import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

// import { verify, decode } from 'jsonwebtoken'
import { verify  } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
// import Axios from 'axios'
// import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'
// import { Certificate } from 'crypto'

const logger = createLogger('auth')

// DONE: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
// const jwksUrl = 'https://dev-b5l8pxg7z3snujdy.us.auth0.com/.well-known/jwks.json'

const certificate = `-----BEGIN CERTIFICATE-----
MIIDHTCCAgWgAwIBAgIJW6MbAXfSSlqmMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNV
BAMTIWRldi1iNWw4cHhnN3ozc251amR5LnVzLmF1dGgwLmNvbTAeFw0yMzAyMjcx
NjM2MjZaFw0zNjExMDUxNjM2MjZaMCwxKjAoBgNVBAMTIWRldi1iNWw4cHhnN3oz
c251amR5LnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBANZ2EN1HuJJIXjTVQsjWBBn3ZnBTnxM588whOPvprC0b6FFX6WyU+QdXEXWB
m1egSFpKQgMq3T7EPIvXLd8fPUBNJUUvQcBYypE9cMgOGuFScmVCEQVxFtexSe7i
ZkS1tntjFtmHFq/Y+akHOKxQqJDMB+asCtVQ1CMaZ+pVNwghn/EnSgpgwJYtIeef
4fllNKFPmpy7hK0dokS7JavfWr/VvJHd4TVfAQ9JC8uV2Zb4yHHjB233C383xX9X
sCQlyLgXMQkmkDWDCnux2vz+nmVsrjME3bDWT7plGEsS35H+7zRJRFVv5RKHtZC+
EZrrnFs2qE+WmTQQmm8+TygwepkCAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd
BgNVHQ4EFgQUSrTr6sECtyUviT8lXtofseZnyYgwDgYDVR0PAQH/BAQDAgKEMA0G
CSqGSIb3DQEBCwUAA4IBAQA+IT3uvquT7pxR/81G5DmGh+gHfB46+VaqLMw1We+M
id+c+VrTMrC1FJF0zFFtZQGwal7T2KledJPJxKmeTWn8AYyzxI8d8+fezVXp8sh5
WfwNiY1CJapAA/xZ8FF26XtBaEOXorDidgwqVVQiE7XXL+18hWGsDVyDVUrZs7xZ
LL3UEx5Yyp2XZgtSEOIctKQP/eJk07Qy7/nYlV45tWS5Kv2pVDxK9KvUO069umQP
ARqhDPxEB3SyPNY+iD0w0fDF2d4RPOgG9MH1tBmLz5kljNaoGBkwoW5rdbXkaOlv
cN5ohq2dBgPBpxCsJ7ibUL6dBVz16nWbRzlDQ1w0uv6a
-----END CERTIFICATE-----`

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

  // DONE: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  // jwt.
  return verify(token, certificate, { algorithms: ['RS256'] }) as JwtPayload
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
