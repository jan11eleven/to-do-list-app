import prisma from '../db/prismaClient';

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
