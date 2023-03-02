import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

// const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('TodosAccess')

// DONE: Implement the dataLayer logic
export class TodosAccess {

    constructor(
      private readonly docClient: DocumentClient = createDynamoDBClient(),
      private readonly todosTable = process.env.TODOS_TABLE) {
    }
  
    async getTodosForUser(userId: string): Promise<TodoItem[]> {
        logger.info('Getting all todos for user ' + userId)
  
      const result = await this.docClient.query({
        TableName: this.todosTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        }        
      }).promise()
  
      const items = result.Items as TodoItem[]
      logger.info('number of items found: ' + items.length)
      
      return items
    }
  
    async createTodo(todo: TodoItem): Promise<TodoItem> {
      await this.docClient.put({
        TableName: this.todosTable,
        Item: todo
      }).promise()
  
      return todo
    }

    async updateTodo(userId: string, todoId: string, todoUpdate: TodoUpdate): Promise<TodoItem> {
      const todo = await this.getTodo(userId, todoId)
      todo.name = todoUpdate.name
      todo.dueDate = todoUpdate.dueDate
      todo.done = todoUpdate.done

      await this.docClient.put({
        TableName: this.todosTable,
        Item: todo
      }).promise()
      
      return todo
    }
      
    async updateAttachmentUrl(userId: string, todoId: string, attachmentUrl: string): Promise<TodoItem> {
      const todo = await this.getTodo(userId, todoId)
      todo.attachmentUrl = attachmentUrl

      await this.docClient.put({
        TableName: this.todosTable,
        Item: todo
      }).promise()
      
      return todo
    }
    
    async deleteTodo(userId: string, todoId: string) {
      const todo = await this.getTodo(userId, todoId)

      await this.docClient.delete({
        TableName: this.todosTable,
        Key: todo
      }).promise()
    }

    async getTodo(userId: string, todoId: string): Promise<TodoItem> {
      const result = await this.docClient.get({
        TableName: this.todosTable,
        Key: {
          'userId': userId,
          'todoId': todoId
        }        
      }).promise()

      if (!result.Item) {
        throw new TodoNotFoundError('user ' + userId + ' has no todo with todoId ' + todoId)
      }
      return result.Item as TodoItem
    }
  }

  function createDynamoDBClient() {
    // if (process.env.IS_OFFLINE) {
    //   console.log('Creating a local DynamoDB instance')
    //   return new XAWS.DynamoDB.DocumentClient({
    //     region: 'localhost',
    //     endpoint: 'http://localhost:8000'
    //   })
    // }
  
    return new AWS.DynamoDB.DocumentClient()
  }