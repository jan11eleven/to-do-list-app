import createTodoAction from '@/app/actions/createTodoAction';
import getAllTodosAction from '@/app/actions/getAllTodosAction';
import deleteTodoAction from '@/app/actions/deleteTodoAction';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const fullUrl = req.url;

    // Parse the query parameters using URLSearchParams
    const queryParams = new URLSearchParams(fullUrl.split('?')[1]);

    const emailParam = queryParams.get('email');

    if (!emailParam) {
      return new Response(
        JSON.stringify({ error: 'Email query param is required' }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
          status: 400,
        }
      );
    }

    const todosData = await getAllTodosAction(emailParam || '');

    return Response.json(todosData);
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const fullUrl = req.url;

    // Parse the query parameters using URLSearchParams
    const queryParams = new URLSearchParams(fullUrl.split('?')[1]);

    const emailParam = queryParams.get('email');

    if (!emailParam) {
      return new Response(
        JSON.stringify({ error: 'Email query param is required' }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
          status: 400,
        }
      );
    }

    const parsedBody = await req.json();

    const createdTodo = await createTodoAction(emailParam, parsedBody);

    return new Response(JSON.stringify(createdTodo), {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 201,
    });
  } catch (error) {}
}

export async function DELETE(req: NextRequest) {
  try {
    const parsedBody = await req.json();

    const todoId = parsedBody.id;

    const deletedTodo = await deleteTodoAction(todoId);

    return new Response(JSON.stringify(deletedTodo), {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 200,
    });
  } catch (error: any) {
    throw new Error(error);
  }
}
