import { TodosAccess } from '../persistence/todosAcess'
// import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
// import * as createError from 'http-errors'
import { TodoUpdate } from '../models/TodoUpdate'
import { S3Access } from '../s3/S3Access'

// DONE: Implement businessLogic
const todosAccess = new TodosAccess()
const s3Access = new S3Access()

export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
    return todosAccess.getTodosForUser(userId)
}

export async function createTodo(userId: string, createTodoRequest: CreateTodoRequest): Promise<TodoItem> {
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

export async function updateTodo(userId: string, todoId: string, updateTodoRequest: UpdateTodoRequest): Promise<TodoItem> {
    const todoUpdate: TodoUpdate = {
        name: updateTodoRequest.name,
        dueDate: updateTodoRequest.dueDate,
        done: updateTodoRequest.done
    }
    return todosAccess.updateTodo(userId, todoId, todoUpdate)
}

export async function deleteTodo(userId: string, todoId: string) {
    todosAccess.deleteTodo(userId, todoId)
}

export async function createAttachmentPresignedUrl(userId: string, todoId: string) {
    const attachmentId = userId + '-' + todoId
    const attachmentUrl = 'https://' + process.env.ATTACHMENT_S3_BUCKET + '.s3.amazonaws.com/' + attachmentId

    todosAccess.updateAttachmentUrl(userId, todoId, attachmentUrl)

    return s3Access.createPresignedUrl(attachmentId)
}



