import getUserDetailsAction from '@/app/actions/getUserDetailsAction';
import createUserAction from '@/app/actions/createUserAction';
import { NextRequest } from 'next/server';
import errorMessages from '../../utils/errorMessages.json';

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
      return Response.json({ message: errorMessages['user.no_user_found'] });
    }

    return Response.json(userDetails);
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function POST(req: NextRequest) {
  const parsedData = await req.json();
  console.log('server: ', parsedData);

  const createdUserData = await createUserAction(
    parsedData.email,
    parsedData.name,
    parsedData.image
  );

  return new Response(JSON.stringify(createdUserData), {
    headers: {
      'Content-Type': 'application/json',
    },
    status: 201,
  });
}
