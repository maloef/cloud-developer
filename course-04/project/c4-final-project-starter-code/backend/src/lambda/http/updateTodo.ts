import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateTodo } from '../../businessLogic/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('updateTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const updateTodoRequest: UpdateTodoRequest = JSON.parse(event.body)
    // DONE: Update a TODO item with the provided id using values in the "updatedTodo" object

    const userId = getUserId(event)
    logger.info('updating todo with todoId ' + todoId + ' for user ' + userId + ', updateRequest: ' + updateTodoRequest)

    try {
      const newTodo = await updateTodo(userId, todoId, updateTodoRequest)
      logger.info('updated todo: ' + newTodo);

      return {
        statusCode: 200,
        body: JSON.stringify({
          item: newTodo
        })
      }
    } catch (err) {
      logger.error(err)
      const statusCode = err instanceof TodoNotFoundError ? 404 : 500
      return {
        statusCode,
        body: null
      }
    }
  })

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
