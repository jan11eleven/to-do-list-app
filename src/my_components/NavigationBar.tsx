'use client';

import { Button } from '@/components/ui/button';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function NavigationBar() {
  const { data: session } = useSession();
  console.log(session);

  const handleSignInButton = async () => {
    await signIn();
  };

  const handleSignOutButton = async () => {
    await signOut();
  };

  return (
    <main className="w-screen flex justify-between items-center px-6 h-16 bg-slate-100">
      <h1>To-Do List</h1>
      <ul className="flex">
        <li className="mr-10">
          {session ? (
            <Button onClick={handleSignOutButton}>Sign Out</Button>
          ) : (
            <Button onClick={handleSignInButton}>Sign In</Button>
          )}
        </li>
      </ul>
    </main>
  );
}
