import { deleteTodoRepo } from '../repository/todos';

async function deleteTodoAction(id: string) {
  try {
    const deletedTodo = await deleteTodoRepo(id);

    return deletedTodo;
  } catch (error: any) {
    throw new Error(error);
  }
}

export default deleteTodoAction;
