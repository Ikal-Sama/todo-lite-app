"use client";

import React from "react";
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
import { RiAddLine } from "@remixicon/react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addNote } from "@/actions/note.action";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const addNoteSchema = z.object({
  title: z.string().min(4),
  description: z.string().min(8),
});

const AddNoteModal = () => {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof addNoteSchema>>({
    resolver: zodResolver(addNoteSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const { handleSubmit, control, formState } = form;

  async function onSubmit(values: z.infer<typeof addNoteSchema>) {
    const res = await addNote(values);
    if (res.success && res.note) {
      form.reset();
      toast.success("Note created successfully");
      queryClient.setQueryData(["notes"], (oldData: any) => {
        return {
          ...oldData,
          notes: [...oldData.notes, res.note], // Add the new note to the existing list
        };
      });
    } else {
      toast.error(res.error);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <RiAddLine />
          Create
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Add Note</DialogTitle>
          <DialogDescription>
            Create a note for your daily activities.
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
                {formState.isSubmitting ? "Creating..." : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNoteModal;
