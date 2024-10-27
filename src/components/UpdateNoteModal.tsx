// "use client";

import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Note } from "@/entities/Note";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "./ui/textarea";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserNoteById, updateNote } from "@/actions/note.action";
import { toast } from "sonner";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  note: string | null;
};

export const updateNoteSchema = z.object({
  title: z.string().min(4),
  description: z.string().min(8),
});

const UpdateNoteModal = ({ isOpen, note, onClose }: Props) => {
  const queryClient = useQueryClient();
  const { data, isFetching } = useQuery({
    queryKey: ["note", note],
    queryFn: () => (note ? getUserNoteById(note) : Promise.resolve(null)),
    enabled: !!note, // Only fetch when note ID is provided
  });

  const form = useForm<z.infer<typeof updateNoteSchema>>({
    resolver: zodResolver(updateNoteSchema),
    defaultValues: {
      title: data?.note?.title || "",
      description: data?.note?.description || "",
    },
  });

  useEffect(() => {
    if (data?.note) {
      form.reset({
        title: data.note.title,
        description: data.note.description,
      });
    }
  }, [data, form]);

  const { handleSubmit, control, formState } = form;

  async function onSubmit(values: z.infer<typeof updateNoteSchema>) {
    //@ts-ignore
    const res = await updateNote(note, values);
    if (res.success && res.note) {
      toast.success("Note updated successfully");
      queryClient.setQueryData(["notes"], (oldData: any) => {
        // Find the index of the note to update
        const noteIndex = oldData.notes.findIndex(
          (n: any) => n.id === res.note.id
        );

        // If the note is found, update it in the array
        if (noteIndex !== -1) {
          return {
            ...oldData,
            notes: [
              ...oldData.notes.slice(0, noteIndex),
              res.note, // Replace the old note with the updated note
              ...oldData.notes.slice(noteIndex + 1),
            ],
          };
        } else {
          // If the note is not found, return the old data
          return oldData;
        }
      });
    } else {
      toast.error(res.error);
    }
    console.log(values);
  }
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Note</DialogTitle>
          <DialogDescription>
            Edit your note below. Press "Save" to save your changes.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='grid gap-4 py-4'>
              <div className='grid grid-cols-1 items-center gap-4'>
                <FormField
                  control={control}
                  name='title'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-left'>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Enter note title'
                          className='col-span-3'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='grid grid-cols-1 items-center gap-4'>
                <FormField
                  control={control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-left'>Descrption</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Write your note description here...'
                          className='col-span-3 h-20'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type='submit' disabled={formState.isSubmitting}>
                {formState.isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateNoteModal;
