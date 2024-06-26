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
import { cn } from '@/lib/utils';
import { ModeToggle } from './ModeToggle';

export default function NavigationBar() {
  const { data: session } = useSession();

  const name = session?.user?.name;

  const handleSignInButton = async () => {
    await signIn();
  };

  const handleSignOutButton = async () => {
    await signOut();
  };

  return (
    <main className="w-screen flex justify-between items-center px-6 h-16">
      <h1 className="font-bold">To-Do List</h1>
      <ul className="flex">
        {session ? (
          <li className="">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="flex items-center">
                  <p className={cn('mr-4', 'hidden', 'md:block')}>{name}</p>
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
                </div>
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
          <li className="">
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
        <li className="ml-4">
          <ModeToggle />
        </li>
      </ul>
    </main>
  );
}
