import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

import SignupForm from "./SignupForm";
import Logo from "./Logo";

const SignupCard = () => {
  return (
    <div>
      <div className='mb-5 flex justify-center items-center'>
        <Logo />
      </div>
      <Card className='w-[400px]'>
        <CardHeader>
          <CardTitle className='font-semibold text-2xl'>Signup</CardTitle>
          <CardDescription>Create your account and sign in</CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupCard;
