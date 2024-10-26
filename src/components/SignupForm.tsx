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
import { RiGoogleFill } from "@remixicon/react";
import { signUp } from "@/actions/auth.action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const SignUpSchema = z
  .object({
    name: z.string().min(5),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const SignupForm = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { handleSubmit, control, formState } = form;

  async function onSubmit(values: z.infer<typeof SignUpSchema>) {
    const res = await signUp(values);
    if (res.success) {
      toast.success("Account created successfully");
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
          name='name'
          render={({ field }) => (
            <FormItem className='mb-2'>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type='text' placeholder='shadcn' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name='email'
          render={({ field }) => (
            <FormItem className='mb-2'>
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
            <FormItem className='mb-2'>
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

        <FormField
          control={control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem className='mb-2'>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  type='password'
                  placeholder='Confirm your password'
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
          className='w-full mt-3'
        >
          {formState.isSubmitting ? "Creating..." : "Create an account"}
        </Button>

        <div className='flex items-center font-medium justify-center mt-3 text-sm'>
          <p className=''>Already have an account?</p>
          <Link href='/' className='hover:text-primary underline ml-2'>
            Sign in
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default SignupForm;
