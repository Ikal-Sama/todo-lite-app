"use server"

import { addNoteSchema } from "@/components/AddNoteModal"
import { getUser } from "@/lib/lucia"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

export const addNote = async (values: z.infer<typeof addNoteSchema>) => {    
    try {
        const user = await getUser()
        const existingNote = await prisma.note.findFirst({
            where: {
                title: values.title,
                userId: user?.id
            }
        })
        if(existingNote) {
            return {success: false, error: 'Note already exists'}
        }
        const newNote = await prisma.note.create({
            data: {
                title: values.title,
                description: values.description,
                userId: user?.id as string,
            }
        })

        return {success: true, note: newNote}
    } catch (error) {
        return {error: 'Something went wrong when creating a note'}
    }
}

export const getUserNotes = async () => {
    const user = await getUser()

    const notes = await prisma.note.findMany({
        where: {
            userId: user?.id
        }
    })

    if(!notes) {
        return {success:false, error: 'Note not found'}
    }
    
    return {success: true, notes: notes}
}

export const deleteNote = async (noteId: string) => {
    try {
        const note = await prisma.note.findUnique({
            where: {
                id: noteId
            }
        })

        if(!note) {
            return {success: false, error: 'Note not found'}
        }
        const deletedNote = await prisma.note.delete({
            where: {
                id: note.id
            }
        })
        return {success: true, note: deletedNote}
    } catch (error) {
        return {success: false, error: 'Something went wrong when deleting a note'}
    }
}

export const deleteAllUserNotes = async() => {
    try {
        const user = await getUser()
        const notes = await prisma.note.findMany({
            where: {
                userId: user?.id
            }
        })

        if(!notes) {
            return {success: false, error: 'Notes not found'}
        }
        const deletedNotes = await prisma.note.deleteMany({
            where: {
                userId: user?.id
            }
        })

        return {success: true, note: deletedNotes}
    } catch (error) {
        return {success: false, error: "Something went wrong deleting all notes"}
    }
}