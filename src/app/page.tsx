import SigninCard from "@/components/SigninCard";
import { getUser } from "@/lib/lucia";
import { redirect } from "next/navigation";
import React from "react";

export default async function Home() {
  const user = await getUser();
  if (user) {
    redirect("/dashboard");
  }
  return (
    <div className='grid place-items-center min-h-screen'>
      <SigninCard />
    </div>
  );
}
