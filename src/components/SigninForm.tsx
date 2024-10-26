"use client";

import React from "react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import Link from "next/link";
import { signIn } from "@/actions/auth.action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import GoogleOauthButton from "./GoogleOAuthButton";

export const SigninSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const SigninForm = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof SigninSchema>>({
    resolver: zodResolver(SigninSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { handleSubmit, control, formState } = form;

  async function onSubmit(values: z.infer<typeof SigninSchema>) {
    const res = await signIn(values);
    if (res.success) {
      toast.success("Login Successful");
      router.push("/dashboard");
    } else {
      toast.error(res.error);
    }
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className=''>
        <FormField
          control={control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type='email'
                  placeholder='shadcn@example.com'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name='password'
          render={({ field }) => (
            <FormItem className='mt-2'>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type='password'
                  placeholder='Enter your password'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type='submit'
          disabled={formState.isSubmitting}
          className='w-full mt-4'
        >
          {formState.isSubmitting ? "Loading..." : "Login"}
        </Button>

        {/* Login using google button */}
        {/* <Button className='mt-4  w-full' variant='outline'>
          <RiGoogleFill /> Login with Google
        </Button> */}
        <GoogleOauthButton />

        <div className='flex items-center font-medium  justify-center mt-3 text-sm'>
          <p className=''>Don&apos;t have an account?</p>
          <Link href='/sign-up' className='hover:text-primary underline ml-2'>
            Sign up
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default SigninForm;
