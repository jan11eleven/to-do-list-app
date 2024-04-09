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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AtSign, Github } from 'lucide-react';

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
      <h1 className="font-bold">To-Do List</h1>
      <ul className="flex">
        {session ? (
          <li className="">
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
            <Dialog>
              <DialogTrigger asChild>
                {/* <Button onClick={handleSignInButton}>Sign In</Button> */}
                <Button>Sign In</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Sign In</DialogTitle>
                  <DialogDescription>
                    Sign in using Github or Google account.
                  </DialogDescription>
                </DialogHeader>
                <Button
                  onClick={() => {
                    signIn('github');
                  }}
                  className="flex h-14"
                >
                  <div>
                    <Github />{' '}
                  </div>
                  <p className="flex-1 text-lg">Sign in with Github</p>
                </Button>
                <Button
                  onClick={() => {
                    signIn('google');
                  }}
                  variant={'outline'}
                  className="flex h-14"
                >
                  <div className="">
                    <AtSign className="" />
                  </div>
                  <p className="flex-1 text-lg">Sign in with Google</p>
                </Button>
              </DialogContent>
            </Dialog>
          </li>
        )}
      </ul>
    </main>
  );
}
