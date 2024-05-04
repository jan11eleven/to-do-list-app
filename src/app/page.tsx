'use client';

import MainPage from '@/my_components/MainPage';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import debounce from './utils/debounce';
import errorMessages from './utils/errorMessages.json';

export default function Home() {
  const { data: session } = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted: boolean = true;

    if (isLoggedIn) return;

    const fetchUserData = async () => {
      try {
        setIsLoading(true);

        if (!session || !session?.user) {
          setIsLoading(false);
          return;
        }

        const rawResponse = await fetch(
          `user/api?email=${session?.user?.email}`
        );

        if (!rawResponse.ok) {
          throw new Error('Encountered an error');
        }

        const userData = await rawResponse.json();

        // create user if user is not logged in
        if (userData.message == errorMessages['user.no_user_found']) {
          const payload = {
            name: session?.user?.name,
            email: session?.user?.email,
            image: session?.user?.image,
          };

          if (!session || !session?.user) return;

          const rawResponse = await fetch(`user/api`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });

          const createdUserData = await rawResponse.json();
        }

        setIsLoggedIn(true);
        setIsLoading(false);
      } catch (error) {
        console.error(error);

        setIsLoading(false);
      }
    };

    // Debounce the fetchUserData function with a delay of 300 milliseconds
    const debouncedFetchUserData = isMounted
      ? debounce(fetchUserData, 300)
      : null;

    if (debouncedFetchUserData) {
      debouncedFetchUserData();
    }

    return () => {
      isMounted = false; // Cleanup function to prevent state updates on unmounted component
    };
  }, [session]);

  if (isLoading) {
    return <div>Validating session...</div>;
  }

  return (
    <main>
      {session ? (
        <div className="mt-8">
          <MainPage fullName={session?.user?.name || ''} />
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center px-6 h-[calc(100vh-64px)] w-screen">
          <p>
            <span className="text-2xl md:text-7xl">Welcome to</span> <br />
          </p>
          <p className="lg:mt-10">
            <span className="text-3xl md:text-8xl font-bold">
              Todo List App
            </span>
          </p>
        </div>
      )}
    </main>
  );
}
