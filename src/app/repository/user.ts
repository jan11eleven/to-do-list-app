import prisma from '../db/prismaClient';

export async function getUserDetailsRepo(
  uuid?: string | null,
  email?: string | null
) {
  try {
    let userDetails;

    if (uuid) {
      userDetails = await prisma.user.findUnique({
        where: { id: uuid },
      });
    } else if (email) {
      userDetails = await prisma.user.findUnique({
        where: { email: email },
      });
    }

    return userDetails;
  } catch (error: any) {
    throw new Error('Error in getting user details: ' + error);
  }
}

export async function createUserRepo() {
  try {
    const userCreated = await prisma.user.create({
      data: {
        name: 'Jan Eleven Salvador',
        email: '2.janelevensalvador@gmail.com',
        image: '123123',
      },
    });

    console.log({ message: 'User successfully created!', data: userCreated });

    return userCreated;
  } catch (error: any) {
    throw new Error(error);
  }
}
