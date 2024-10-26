import React from "react";
import { SquareCheckBig } from "lucide-react";

const Logo = () => {
  return (
    <div className='flex gap-2 items-center'>
      <div className='bg-primary p-1 rounded-md'>
        <SquareCheckBig className='text-white w-5 h-5' />
      </div>
      <h1 className='text-2xl font-bold'>
        Todo<span className='text-primary'>Lite</span>
      </h1>
    </div>
  );
};

export default Logo;
