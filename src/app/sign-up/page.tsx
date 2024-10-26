import SignupCard from "@/components/SignupCard";
import { getUser } from "@/lib/lucia";
import { redirect } from "next/navigation";
import React from "react";

export default async function SignupPage() {
  const user = await getUser();
  if (user) {
    redirect("/dashboard");
  }
  return (
    <div className='grid place-items-center min-h-screen'>
      <SignupCard />
    </div>
  );
}
