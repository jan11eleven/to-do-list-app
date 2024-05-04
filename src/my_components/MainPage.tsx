import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ClipboardPlus } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { addTodoSchema, editTodoSchema } from '@/app/utils/zodSchemas';
import constants from '@/app/utils/contants.json';

type Todo = {
  id: string;
  name: string;
  description: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};

export default function MainPage({ fullName }: { fullName: string }) {
  // set session/states
  const { data: session } = useSession();
  const [todos, setTodos] = useState<Todo[]>([]);
  const { toast } = useToast();
  const [isAddTodoLoading, setIsAddTodoLoading] = useState(false);
  const [deleteTodoData, setDeleteTodoData] = useState<Todo>();

  // edit form
  const editTodoForm = useForm<z.infer<typeof editTodoSchema>>({
    resolver: zodResolver(editTodoSchema),
  });

  async function editStatusTodoOnChange(
    values: z.infer<typeof editTodoSchema>
  ) {
    const parseResult = editTodoSchema.safeParse(values);

    if (!parseResult.success) {
      toast({
        title: 'Invalid Input!',
        description: `Please fix the error.`,
        variant: 'destructive',
      });
      return;
    }

    const callUpdateTodo = async () => {
      try {
        const rawResponse = await fetch(`todos/api?email=${values.userId}`, {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!rawResponse.ok) {
          throw new Error('Error in editing Todos API');
        }

        const updatedTodo = await rawResponse.json();

        fetchAllTodos();

        toast({
          title: 'Todo have successfully updated!',
          description: `Your todo status - ${updatedTodo.name}: ${updatedTodo.status}`,
          variant: 'success',
        });
      } catch (error: any) {
        throw new Error(error);
      }
    };

    await callUpdateTodo();
  }

  async function editTodoOnSubmit(values: z.infer<typeof editTodoSchema>) {
    const parseResult = editTodoSchema.safeParse(values);

    if (!parseResult.success) {
      toast({
        title: 'Invalid Input!',
        description: `Please fix the error.`,
        variant: 'destructive',
      });
      return;
    }

    const callUpdateTodo = async () => {
      try {
        const rawResponse = await fetch(`todos/api?email=${values.userId}`, {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!rawResponse.ok) {
          throw new Error('Error in editing Todos API');
        }

        const updatedTodo = await rawResponse.json();

        fetchAllTodos();

        toast({
          title: 'Todo have successfully updated!',
          description: `You have new todo - ${updatedTodo.name}`,
          variant: 'success',
        });
      } catch (error: any) {
        throw new Error(error);
      }
    };

    await callUpdateTodo();
  }

  // add form
  const addTodoForm = useForm<z.infer<typeof addTodoSchema>>({
    resolver: zodResolver(addTodoSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  // Add Todo onsubmit
  async function addTodoOnSubmit(values: z.infer<typeof addTodoSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const parseResult = addTodoSchema.safeParse(values);

    setIsAddTodoLoading(true);
    if (!parseResult.success) {
      toast({
        title: 'Invalid Input!',
        description: `Please fix the error.`,
        variant: 'destructive',
      });
      return;
    }

    const postTodo = async () => {
      try {
        const rawResponse = await fetch(
          `todos/api?email=${session?.user?.email}`,
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          }
        );

        if (!rawResponse.ok) {
          throw new Error('Error in fetching Todos API');
        }

        const createdTodo = await rawResponse.json();

        fetchAllTodos();

        toast({
          title: 'Successfully added new Todo!',
          description: `You have new todo - ${createdTodo.name}`,
          variant: 'success',
        });

        setIsAddTodoLoading(false);
        addTodoForm.reset();
      } catch (error: any) {
        throw new Error(error);
      }
    };

    await postTodo();
  }

  // function for getting all todos
  const fetchAllTodos = async () => {
    const rawResponse = await fetch(`todos/api?email=${session?.user?.email}`);

    if (!rawResponse.ok) {
      throw new Error('Error in fetching Todos API');
    }

    const todosData = await rawResponse.json();

    setTodos(todosData);
  };

  // delete todo handler
  async function handleDeleteTodo(id: string) {
    const callDeleteTodo = async () => {
      try {
        const rawResponse = await fetch(
          `todos/api?email=${session?.user?.email}`,
          {
            method: 'DELETE',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id }),
          }
        );

        if (!rawResponse.ok) {
          throw new Error('Error in calling DELETE Todo API');
        }

        const deletedTodo = await rawResponse.json();

        fetchAllTodos();

        toast({
          title: 'Todo successfully deleted!',
          description: `Deleted todo - ${deletedTodo.name}`,
          variant: 'destructive',
        });
      } catch (error: any) {
        throw new Error(error);
      }
    };

    await callDeleteTodo();
  }

  // fetch all todos when mounted
  useEffect(() => {
    fetchAllTodos();
  }, []);

  return (
    <main className="px-6">
      {/* <p className="mb-10 font-semibold">Welcome, {fullName}</p> */}
      {/* Todo Add Modal */}
      <div className="mb-10">
        <Form {...addTodoForm}>
          {/* Start Add Todo Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  addTodoForm.setValue('name', '');
                  addTodoForm.setValue('description', '');
                }}
                disabled={todos.length < 10 ? false : true}
              >
                <ClipboardPlus className="mr-2 h-4 w-4" /> Add Todo
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Todo</DialogTitle>
                <DialogDescription>
                  Provide the name and description of your todo.
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={addTodoForm.handleSubmit(addTodoOnSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={addTodoForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Todo Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addTodoForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          id="description"
                          placeholder="Todo Description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {todos.length < 10 ? (
                  ''
                ) : (
                  <DialogDescription className="italic">
                    Todo max limit reached. Delete some of your todo to create
                    another.
                  </DialogDescription>
                )}
                <DialogFooter>
                  {isAddTodoLoading ? (
                    <Button disabled>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={todos.length < 10 ? false : true}
                    >
                      Add
                    </Button>
                  )}
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          {/* End Add Todo Dialog */}
        </Form>
      </div>
      {/* Todos Table */}
      <div>
        <h1 className="text-3xl font-bold">My Todo's</h1>

        {/* starts table */}
        <Table>
          <TableCaption>A list of your todos.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-3/12">Name</TableHead>
              <TableHead className="w-3/12">Description</TableHead>
              <TableHead className="w-2/12">Status</TableHead>
              <TableHead className="w-2/12">Date Created</TableHead>
              <TableHead className="w-1/12">Mark as Done</TableHead>
              <TableHead className="w-1/12">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {todos.map((todo) => (
              <TableRow key={todo.id}>
                <TableCell className="font-medium">{todo.name}</TableCell>
                <TableCell>{todo.description}</TableCell>
                <TableCell>{todo.status}</TableCell>
                <TableCell>
                  {format(todo.createdAt, 'MMM dd, yyyy - p')}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={todo.status === constants['TODO_STATUS_DONE']}
                    onCheckedChange={async () => {
                      todo.status =
                        todo.status === constants['TODO_STATUS_DONE']
                          ? constants['TODO_STATUS_ONGOING']
                          : constants['TODO_STATUS_DONE'];
                      editStatusTodoOnChange(todo);
                    }}
                  />
                </TableCell>
                <TableCell className="text-right flex justify-end">
                  {/* Start Edit Dialog */}
                  <Form {...editTodoForm}>
                    <Dialog>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Edit Todo</DialogTitle>
                        </DialogHeader>
                        <form
                          onSubmit={editTodoForm.handleSubmit(editTodoOnSubmit)}
                        >
                          <FormField
                            control={editTodoForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={editTodoForm.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <DialogFooter className="sm:justify-between mt-10">
                            <DialogClose asChild>
                              <Button variant="secondary">Close</Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button type="submit">Save</Button>
                            </DialogClose>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                      <DialogTrigger asChild>
                        <Button
                          className="mr-2"
                          variant={'secondary'}
                          onClick={() => {
                            editTodoForm.setValue('id', todo.id);
                            editTodoForm.setValue('name', todo.name);
                            editTodoForm.setValue(
                              'description',
                              todo.description
                            );
                            editTodoForm.setValue('status', todo.status);
                            editTodoForm.setValue('createdAt', todo.createdAt);
                            editTodoForm.setValue('userId', todo.userId);
                            editTodoForm.setValue('updatedAt', todo.updatedAt);
                            console.log(editTodoForm.getValues());
                          }}
                        >
                          Edit
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                  </Form>
                  {/* End Edit Dialog */}
                  {/* Start Delete Todo Dialog */}
                  <Dialog>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>
                          Delete Todo: <span>{deleteTodoData?.name}</span>
                        </DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete?
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="sm:justify-between">
                        <DialogClose asChild>
                          <Button type="button" variant="secondary">
                            Close
                          </Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() => {
                              handleDeleteTodo(deleteTodoData?.id || '');
                            }}
                          >
                            Delete
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                    <DialogTrigger asChild>
                      <Button
                        variant={'destructive'}
                        onClick={() => {
                          setDeleteTodoData(todo);
                        }}
                      >
                        Delete
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                  {/* End Delete Todo Dialog */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
