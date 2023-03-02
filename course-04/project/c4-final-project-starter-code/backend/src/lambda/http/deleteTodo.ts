import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('deleteTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    // DONE: Remove a TODO item by id
    
    const userId = getUserId(event)
    logger.info('deleting todo with todoId', todoId,  'from user', userId)

    try {
      deleteTodo(userId, todoId)
      logger.info("deleted todo")

      return {
        statusCode: 204,
        body: undefined
      }
    } catch (err) {
      logger.error(err)
      const statusCode = err instanceof TodoNotFoundError ? 404 : 500
      return {
        statusCode,
        body: undefined
      }
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
