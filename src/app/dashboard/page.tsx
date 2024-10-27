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
import SearchNote from "@/components/SearchNote";

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
          <SearchNote />
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
    </div>
  );
};

export default Dashboard;
