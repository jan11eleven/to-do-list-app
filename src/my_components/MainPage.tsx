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
import { todoNameRegex, todoDescriptionRegex } from '@/app/utils/regex';
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
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

type Todo = {
  id: string;
  name: string;
  description: string;
  status: string;
  createdAt: Date;
};

// zodSchema
const todoSchema = z.object({
  name: z
    .string()
    .max(255)
    .min(1, { message: 'Name is required!' })
    .regex(todoNameRegex, {
      message: 'Only special characters allowed - -/.,%|()[]',
    })
    .trim(),
  description: z
    .string()
    .max(255)
    .min(1, { message: 'Description is required!' })
    .regex(todoDescriptionRegex, {
      message: 'Only special characters allowed:  -/.,%|()[] ',
    })
    .trim(),
});

export default function MainPage({ fullName }: { fullName: string }) {
  // set session/states
  const { data: session } = useSession();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { toast } = useToast();
  const [isAddTodoLoading, setIsAddTodoLoading] = useState(false);
  const [deleteTodoData, setDeleteTodoData] = useState<Todo>();
  const [editTodoData, setEditTodoData] = useState<Todo>();

  // add form
  const form = useForm<z.infer<typeof todoSchema>>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      name: editTodoData ? editTodoData.name : '',
      description: editTodoData ? editTodoData.description : '',
    },
  });

  // function for getting all todos
  const fetchAllTodos = async () => {
    const rawResponse = await fetch(`todos/api?email=${session?.user?.email}`);

    if (!rawResponse.ok) {
      throw new Error('Error in fetching Todos API');
    }

    const todosData = await rawResponse.json();

    console.log(todosData);
    setTodos(todosData);
  };

  // Add Todo onsubmit
  function onSubmit(values: z.infer<typeof todoSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const parseResult = todoSchema.safeParse(values);

    setIsAddTodoLoading(true);
    if (!parseResult.success) {
      console.log(parseResult);
      console.log('Invalid Input!');
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
          title: 'Todo successfully added!',
          description: `You have new todo - ${createdTodo.name}`,
          variant: 'success',
        });

        setIsAddTodoLoading(false);
        form.reset();
      } catch (error: any) {
        throw new Error(error);
      }
    };

    postTodo();
  }

  // delete todo handler
  function handleDeleteTodo(id: string) {
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

    callDeleteTodo();
  }

  // fetch all todos when mounted
  useEffect(() => {
    fetchAllTodos();
  }, []);

  return (
    <main className="px-6">
      <p className="mb-10 font-semibold">Welcome, {fullName}</p>
      {/* Todo Add Modal */}
      <div className="mb-10">
        <Form {...form}>
          {/* Start Add Todo Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  form.setValue('name', '');
                  form.setValue('description', '');
                }}
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
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
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
                  control={form.control}
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
                <DialogFooter>
                  {isAddTodoLoading ? (
                    <Button disabled>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </Button>
                  ) : (
                    <Button type="submit">Add</Button>
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
              <TableHead className="">Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date Created</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {todos.map((todo) => (
              <TableRow key={todo.id}>
                <TableCell className="font-medium">{todo.name}</TableCell>
                <TableCell>{todo.description}</TableCell>
                <TableCell>{todo.status}</TableCell>
                <TableCell>{format(todo.createdAt, 'MMM-dd-yyyy p')}</TableCell>
                <TableCell className="text-right flex justify-end">
                  {/* Start Edit Dialog */}
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                      <Dialog>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Edit Todo</DialogTitle>
                          </DialogHeader>
                          <FormField
                            control={form.control}
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
                            control={form.control}
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
                          <DialogFooter className="sm:justify-between">
                            <DialogClose asChild>
                              <Button
                                type="button"
                                variant="secondary"
                                onClick={() => {
                                  form.setValue('name', '');
                                  form.setValue('description', '');
                                }}
                              >
                                Close
                              </Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button
                                type="button"
                                onClick={() => {
                                  handleDeleteTodo(deleteTodoData?.id || '');
                                }}
                              >
                                Save
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                        <DialogTrigger asChild>
                          <Button
                            className="mr-2"
                            variant={'secondary'}
                            onClick={() => {
                              form.setValue('name', todo.name);
                              form.setValue('description', todo.description);
                            }}
                          >
                            Edit
                          </Button>
                        </DialogTrigger>
                      </Dialog>
                    </form>
                  </Form>
                  {/* End Delete Dialog */}
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
