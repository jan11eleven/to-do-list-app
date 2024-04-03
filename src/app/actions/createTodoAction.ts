import { createTodoRepo } from '../repository/todos';

async function createTodoAction(
  email: string,
  todo: { name: string; description: string }
) {
  try {
    const createdTodo = await createTodoRepo(email, todo);

    return createdTodo;
  } catch (error: any) {
    throw new Error(error);
  }
}

export default createTodoAction;
