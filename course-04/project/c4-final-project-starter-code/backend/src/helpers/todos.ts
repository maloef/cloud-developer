import { TodosAccess } from './todosAcess'
// import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'

// TODO: Implement businessLogic
const todosAccess = new TodosAccess()

export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
    return todosAccess.getTodosForUser(userId)
}

export async function createTodo(createTodoRequest: CreateTodoRequest, userId: string): Promise<TodoItem> {
    const todo: TodoItem = {
        userId: userId,
        createdAt: new Date().toISOString(),
        todoId: uuid.v4(),
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        done: false
    }

    return todosAccess.createTodo(todo)
}
