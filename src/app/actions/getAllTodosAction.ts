import { getAllTodosRepo, createTodoRepo } from '../repository/todos';

async function getAllTodosAction(email: string) {
  try {
    const todoData = await getAllTodosRepo(email);

    console.log('todoData', todoData);

    return todoData;
  } catch (error: any) {
    throw new Error(error);
  }
}

export default getAllTodosAction;
