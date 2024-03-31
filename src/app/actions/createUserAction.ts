import { createUserRepo } from '../repository/user';

async function createUserAction(email: string, name: string, image: string) {
  try {
    const createdUserData = await createUserRepo(name, email, image);

    return createdUserData;
  } catch (error: any) {
    throw new Error(error);
  }
}

export default createUserAction;
