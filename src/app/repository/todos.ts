import prisma from '../db/prismaClient';
import TodoType from '../types/TodoType';

enum TaskStatuses {
  Ongoing,
  Done,
}

export async function getAllTodosRepo(email: string) {
  try {
    const allTodos = await prisma.todos.findMany({
      where: { userId: email },
      orderBy: [{ createdAt: 'asc' }],
    });

    return allTodos;
  } catch (error: any) {
    throw new Error('Error in fetching all todos', error);
  }
}

export async function createTodoRepo(
  email: string,
  todo: { name: string; description: string }
) {
  try {
    const createdTodo = await prisma.todos.create({
      data: {
        name: todo.name,
        description: todo.description,
        status: 'Ongoing',
        userId: email,
      },
    });

    return createdTodo;
  } catch (error: any) {
    throw new Error('Error in creating a todo', error);
  }
}

export async function deleteTodoRepo(id: string) {
  try {
    const deleteTodo = await prisma.todos.delete({ where: { id: id } });

    return deleteTodo;
  } catch (error: any) {
    throw new Error('Error in deleting todo: ', error);
  }
}

export async function updateTodoRepo(taskData: TodoType) {
  try {
    const updateTodo = await prisma.todos.update({
      where: {
        id: taskData.id,
      },
      data: taskData,
    });

    return updateTodo;
  } catch (error: any) {
    throw new Error('Error in updating todo: ', error);
  }
}
