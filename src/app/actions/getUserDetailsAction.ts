import { getUserDetailsRepo } from '../repository/user';

export default async function getUserDetailsAction(
  uuid?: string | null,
  email?: string | null
) {
  try {
    const userDetails = await getUserDetailsRepo(uuid, email);

    return userDetails;
  } catch (error: any) {
    throw new Error(error);
  }
}
