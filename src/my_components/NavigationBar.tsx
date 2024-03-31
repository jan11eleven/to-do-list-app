'use client';

import { Button } from '@/components/ui/button';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function NavigationBar() {
  const { data: session } = useSession();

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
        {session ? (
          <li className="mr-10">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage
                    src={
                      session?.user?.image
                        ? session?.user?.image
                        : 'https://github.com/shadcn.png'
                    }
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* <DropdownMenuItem>{session?.user?.name}</DropdownMenuItem> */}
                <DropdownMenuItem onClick={handleSignOutButton}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        ) : (
          <li className="mr-10">
            <Button onClick={handleSignInButton}>Sign In</Button>
          </li>
        )}
      </ul>
    </main>
  );
}
