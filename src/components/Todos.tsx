"use client";
import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNoteStore } from "@/store/note";
import Image from "next/image";
import {
  deleteAllUserNotes,
  deleteNote,
  getUserNotes,
} from "@/actions/note.action";
import { Button } from "./ui/button";
import { RiDeleteBinLine, RiMore2Line, RiQuestionLine } from "@remixicon/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import LoadingSpinner from "./LoadingSpinner";
import AlertDialogModal from "./modal/AlertDialog";
import UpdateNoteModal from "./UpdateNoteModal";

const Todos = () => {
  const queryClient = useQueryClient();
  const { data, isFetching } = useQuery({
    queryKey: ["notes"],
    queryFn: getUserNotes,
  });
  const [checkedNotes, setCheckedNotes] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [deletionMode, setDeletionMode] = useState<"single" | "all">("single");
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);

  if (isFetching) {
    return <LoadingSpinner />;
  }

  const handleDelete = async (id: string) => {
    const res = await deleteNote(id);
    if (res.success && res.note) {
      toast.success("Note deleted successfully");
      queryClient.setQueryData(["notes"], (oldData) => {
        return {
          //@ts-expect-error
          ...oldData,
          // delete the note in the list
          //@ts-expect-error
          notes: oldData.notes.filter((note: any) => note.id !== id),
        };
      });
    } else {
      toast.error(res.error);
    }
  };

  const handleCheckedboxChange = (id: string) => {
    if (checkedNotes.includes(id)) {
      setCheckedNotes(checkedNotes.filter((noteId) => noteId != id));
    } else {
      setCheckedNotes([...checkedNotes, id]);
    }
  };

  const handleDeleteSelectedNotes = async () => {
    setLoading(true);
    if (checkedNotes.length > 0) {
      // Delete multiple notes concurrently
      const deletePromises = checkedNotes.map((noteId) => handleDelete(noteId));
      await Promise.all(deletePromises);

      setLoading(false);
      // Reset selected notes and uncheck Select All
      setCheckedNotes([]);
      setSelectAll(false);
    } else if (selectAll) {
      // Delete all notes
      const res = await deleteAllUserNotes();
      if (res.success) {
        toast.success("All notes deleted successfully");
        queryClient.setQueryData(["notes"], { notes: [] });
        setCheckedNotes([]);
        setSelectAll(false);
      } else {
        toast.error(res.error);
      }
      // Stop loading indication after deletion completes
      setLoading(false);
    }
  };

  const handleSelectAllNotes = async () => {
    setSelectAll(!selectAll);
    if (selectAll) {
      setCheckedNotes([]);
    } else {
      //@ts-ignore
      setCheckedNotes(data.notes.map((note) => note.id));
    }
  };

  const openDeleteModal = (mode: "single" | "all", noteId?: string) => {
    setDeletionMode(mode);
    if (noteId) setCurrentNoteId(noteId);
    setIsOpenModal(true);
  };

  const confirmDeletion = async () => {
    setIsOpenModal(false);
    if (deletionMode === "single" && currentNoteId) {
      await handleDelete(currentNoteId);
    } else {
      await handleDeleteSelectedNotes();
    }
    setCurrentNoteId(null);
  };

  return (
    <div className='h-full'>
      <UpdateNoteModal
        isOpen={isUpdateModalOpen}
        note={currentNoteId}
        onClose={() => setIsUpdateModalOpen(false)}
      />

      <AlertDialogModal
        title={
          <div className='flex gap-2 items-center'>
            <span>Confirm Deletion</span>
            <RiQuestionLine className='text-primary' />
          </div>
        }
        description='Are you sure you want to delete the selected note(s)? This action cannot be undone.'
        submitButtonText={loading ? "Deleting..." : "Confirm"}
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        onConfirm={confirmDeletion}
      />
      {data?.notes && data.notes.length > 0 ? (
        <div className='h-full overflow-auto rounded-md overflow-y-scroll scrollbar-thumb-rounded-sm scrollbar-thin scrollbar-thumb-primary-DEFAULT scrollbar-w-2 flex flex-col gap-2 shadow-sm '>
          {/* add a select all then checked all the notes then i can delete all */}
          <div className='flex justify-between px-2 items-center'>
            <div className='flex items-center gap-2'>
              <Checkbox
                checked={selectAll}
                onCheckedChange={handleSelectAllNotes}
              />
              <span className='text-sm text-muted-foreground font-medium'>
                Select All
              </span>
            </div>
            <div className=''>
              {checkedNotes.length > 0 && (
                <Button
                  size='icon'
                  variant='destructive'
                  onClick={() => openDeleteModal("all")}
                  disabled={checkedNotes.length === 0}
                >
                  <RiDeleteBinLine className='w-4 h-4' />
                </Button>
              )}
            </div>
          </div>
          {data.notes?.map((note, index) => (
            <div key={index} className='border p-2 rounded-md bg-white'>
              <div className='flex justify-between items-center'>
                <div className='flex items-center gap-4'>
                  <Checkbox
                    value={note.id}
                    checked={checkedNotes.includes(note.id)}
                    onCheckedChange={() => handleCheckedboxChange(note.id)}
                  />
                  <h1 className='capitalize font-medium'>{note.title}</h1>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' size='icon'>
                      <RiMore2Line className='w-5 h-5 text-muted-foreground' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>View</DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setCurrentNoteId(note.id);
                        setIsUpdateModalOpen(true);
                      }}
                    >
                      Update
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => openDeleteModal("single", note.id)}
                    >
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center py-16 '>
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
      )}
    </div>
  );
};

export default Todos;
