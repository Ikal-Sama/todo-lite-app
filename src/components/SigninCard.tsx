import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

import Logo from "./Logo";
import SigninForm from "./SigninForm";

const SigninCard = () => {
  return (
    <div>
      <div className='mb-5 flex justify-center items-center'>
        <Logo />
      </div>
      <Card className='w-[380px]'>
        <CardHeader>
          <CardTitle className='font-semibold text-2xl'>Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SigninForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default SigninCard;
