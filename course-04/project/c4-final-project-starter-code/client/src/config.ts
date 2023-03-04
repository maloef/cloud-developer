// DONE: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '2pg7ueqj1a'
export const apiEndpoint = `https://${apiId}.execute-api.eu-central-1.amazonaws.com/dev`

export const authConfig = {
  // DONE: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-b5l8pxg7z3snujdy.us.auth0.com',            // Auth0 domain
  clientId: 'CZ52UAnUgAUNwFrRoq6lsE20r3bWjVAG',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
