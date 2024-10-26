import Logo from "@/components/Logo";
import ProfileSettings from "@/components/ProfileSettings";
import SignOutButton from "@/components/SignOutButton";
import { getUser } from "@/lib/lucia";
import Image from "next/image";
import { redirect } from "next/navigation";
import { RiAddLine, RiSearch2Line } from "@remixicon/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AddNoteModal from "@/components/AddNoteModal";
import { getUserNotes } from "@/actions/note.action";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import Todos from "@/components/Todos";
import LoadTodos from "@/components/LoadTodos";

const Dashboard = async () => {
  const user = await getUser();
  if (!user) {
    redirect("/");
  }

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["notes"],
    queryFn: getUserNotes,
  });

  return (
    <div className='w-[600px] h-[500px] border max-w-screen-md mx-auto mt-20 p-5 rounded-md shadow-sm'>
      <div className='flex justify-between items-center'>
        <Logo />
        <ProfileSettings
          picture={
            user.picture
              ? user.picture
              : "https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTAxL3JtNjA5LXNvbGlkaWNvbi13LTAwMi1wLnBuZw.png"
          }
          email={user.email}
          name={user.name}
        />
      </div>
      <div className='mt-10'>
        <div className='flex justify-between items-center'>
          {/* Search here */}
          <div className='relative'>
            <Input placeholder='Find note' className='w-[300px] ' />
            <RiSearch2Line className='absolute top-2 right-2 w-5 h-5 text-muted-foreground' />
          </div>
          {/* Add note modal */}
          <AddNoteModal />
        </div>
      </div>

      <div className=' h-[0.5px] bg-gray-100 w-full mt-8' />
      <div className='bg-gray-50 p-3 rounded-md pb-3 mt-2 h-[298px]'>
        {/* <LoadTodos /> */}
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Todos />
        </HydrationBoundary>
      </div>

      {/* {notes.notes && notes.notes?.length > 0 ? (
        notes.notes && (
          <div className='mt-5'>
            {notes.notes?.map((note, index) => (
              <div key={index} className='border p-2 rounded-md'>
                <div>
                  <h1 className='capitalize font-medium'>{note.title}</h1>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className='flex flex-col items-center justify-center py-20 '>
          <div className='bg-red-50 p-5 rounded-full'>
            <Image
              src='/assets/notebook.png'
              alt='Note Image Empty'
              width={100}
              height={100}
              className='bg-none'
            />
          </div>
          <h1 className='text-lg font-medium mt-4'>
            You don&apos;t have a note.
          </h1>
          <p className='text-muted-foreground'>Create your first note</p>
        </div>
      )} */}
    </div>
  );
};

export default Dashboard;
