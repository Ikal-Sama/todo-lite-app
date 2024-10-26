"use client";

import React from "react";
import { logOut } from "@/actions/auth.action";
import { RiLogoutBoxRLine } from "@remixicon/react";

type Props = {
  children: React.ReactNode;
};

const SignOutButton = ({ children }: Props) => {
  return (
    <div
      className='font-medium flex gap-2 items-center'
      onClick={() => {
        logOut();
      }}
    >
      {children} <RiLogoutBoxRLine className='w-4 h-4' />
    </div>
  );
};

export default SignOutButton;
