import getUserDetailsAction from '@/app/actions/getUserDetailsAction';
import { createUserRepo } from '@/app/repository/user';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const fullUrl = req.url;

    // Parse the query parameters using URLSearchParams
    const queryParams = new URLSearchParams(fullUrl.split('?')[1]);

    const emailParam = queryParams.get('email');
    const uuidParam = queryParams.get('uuid');

    const userDetails = await getUserDetailsAction(uuidParam, emailParam);
    console.log(userDetails);

    if (!userDetails) {
      return Response.json({ message: 'no user found' });
    }

    return Response.json(userDetails);
  } catch (error: any) {
    throw new Error(error);
  }
}
