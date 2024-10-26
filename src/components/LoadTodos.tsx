"use client";

import React, { useEffect } from "react";
import Todos from "./Todos";
import { useNoteStore } from "@/store/note";

const LoadTodos = () => {
  const loadNotes = useNoteStore((state) => state.loadNotes);
  useEffect(() => {
    loadNotes();
  }, []);
  return (
    <div>
      <Todos />
    </div>
  );
};

export default LoadTodos;
