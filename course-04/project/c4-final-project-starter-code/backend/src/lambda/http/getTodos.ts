import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getTodosForUser as getTodosForUser } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('getTodos')

// DONE: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event)
    logger.info('getting todos for user ' + userId)

    const todos = await getTodosForUser(userId)
    logger.info('number of todos found: ' + todos.length)
    logger.info('todos found: ' + todos)

    return {
      statusCode: 200,
      body: JSON.stringify({
        items: todos
      })
    }  
  }
)

handler.use(
  cors({
    credentials: true
  })
)
