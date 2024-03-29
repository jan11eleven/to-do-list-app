'use client';

import MainPage from '@/my_components/MainPage';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();
  console.log(session);

  fetch('/user/api');

  return (
    <main>
      {session ? (
        <div className="mt-8">
          <MainPage fullName={session?.user?.name || ''} />
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center px-6 h-[calc(100vh-64px)] w-screen">
          <p>
            <span className="text-7xl">Welcome to</span> <br />
          </p>
          <p className="mt-10">
            <span className="text-8xl font-bold">Todo List App</span>
          </p>
        </div>
      )}
    </main>
  );
}
