import { updateTodoRepo } from '../repository/todos';
import TodoType from '../types/TodoType';

async function editTodoAction(taskData: TodoType) {
  try {
    const updateTodo = await updateTodoRepo(taskData);

    return updateTodo;
  } catch (error: any) {
    throw new Error(error);
  }
}

export default editTodoAction;
