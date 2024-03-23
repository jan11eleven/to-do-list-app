import { Button } from '@/components/ui/button';

export default function NavigationBar() {
  return (
    <main className="w-screen flex justify-between items-center px-6 h-16 bg-slate-100">
      <h1>To-Do List</h1>
      <ul className="flex">
        <li className="mr-10">
          <Button>Login</Button>
        </li>
        <li>
          <Button>Sign-up</Button>
        </li>
      </ul>
    </main>
  );
}
