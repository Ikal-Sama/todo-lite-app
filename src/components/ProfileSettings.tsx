import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import Image from "next/image";

import { RiExpandUpDownLine } from "@remixicon/react";
import SignOutButton from "./SignOutButton";

const ProfileSettings = ({
  picture,
  email,
  name,
}: {
  picture: string;
  email: string;
  name: string;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='flex gap-2 items-center border py-1 px-2 rounded-md hover:bg-gray-100'>
        <Image
          src={picture}
          alt='Profile Avatar'
          width={30}
          height={30}
          className='rounded-md'
        />
        <p className='flex flex-col items-start'>
          <span className='text-sm'>{name}</span>
          <span className='text-muted-foreground text-xs'>{email}</span>
        </p>

        <RiExpandUpDownLine className='text-muted-foreground w-5 h-5' />
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem className='hover:cursor-pointer'>
          <SignOutButton>Logout</SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileSettings;
