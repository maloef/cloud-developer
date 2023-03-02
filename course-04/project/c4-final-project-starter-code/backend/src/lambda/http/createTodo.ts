import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'

const logger = createLogger('getTodos')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const createTodoRequest: CreateTodoRequest = JSON.parse(event.body)
    // DONE: Implement creating a new TODO item
    const userId = getUserId(event)
    logger.info('creating todo for user', userId, ": ", createTodoRequest)

    const newTodo = createTodo(userId, createTodoRequest)
    logger.info("created todo:", newTodo);

    return {
      statusCode: 201,
      body: JSON.stringify({
        todo: newTodo
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
