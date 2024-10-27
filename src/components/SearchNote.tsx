"use client";
import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { RiSearch2Line } from "@remixicon/react";
import { searchNotes } from "@/actions/note.action";
import { useQuery } from "@tanstack/react-query";

const SearchNote = () => {
  return (
    <div className='relative'>
      <Input placeholder='Find note' className='w-[300px] ' />
      <RiSearch2Line className='absolute top-2 right-2 w-5 h-5 text-muted-foreground' />
    </div>
  );
};

export default SearchNote;
