"use server"

import { z } from "zod"
import { SignUpSchema } from "@/components/SignupForm"
import { prisma } from "@/lib/prisma"
import {Argon2id} from 'oslo/password'
import { lucia } from "@/lib/lucia"
import { cookies } from "next/headers"
import { SigninSchema } from "@/components/SigninForm"
import { redirect } from "next/navigation"
import { generateCodeVerifier, generateState } from "arctic"
import { googleOAuthClient } from "@/lib/googleOAuth"

export const signUp = async (values: z.infer<typeof SignUpSchema>) => {    
    try {
        // if user already exists, throw an error
        const existingUser = await prisma.user.findUnique({
            where: {
                email: values.email
            }
        })
        if(existingUser) {
            return {error: 'User already exists', success: false}
        }

        // hashed the password
        const hashedPassword = await new Argon2id().hash(values.password)

        // create a new user in the database and log them in
        const user = await prisma.user.create({
            data: {
                email: values.email.toLowerCase(),
                name: values.name,
                hashedPassword
            }
        })
        
        // create a session and and store the session in the cookies
        const session = await lucia.createSession(user.id, {})
        const sessionCookie = await lucia.createSessionCookie(session.id)
        cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
        return {success: true}
    } catch (error) {
        return {error: 'Something went wrong', success: false}
    }
}

export const signIn = async (values: z.infer<typeof SigninSchema>) => {
    const user = await prisma.user.findUnique({
        where: {
            email: values.email
        }
    })
    if(!user || !user.hashedPassword) {
        return {success: false, error: "Invalid Credentials"}
    }

    const passwordMatch = await new Argon2id().verify(user.hashedPassword, values.password)
    if(!passwordMatch) {
        return {success: false, error: "Wrong Password"}
    }

    // successfully login
    const session = await lucia.createSession(user.id, {})
    const sessionCookie = await lucia.createSessionCookie(session.id)
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
    return {success: true}
}

export const logOut = async () => {
    const sessionCookie = await lucia.createBlankSessionCookie()
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
    redirect('/')
}

export const getGoogleOAuthConsentUrl = async () => {
    try {
        const state = generateState()
        const codeVerifier = generateCodeVerifier()

        cookies().set('codeVerifier', codeVerifier, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        })
        cookies().set('state', state, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        })

        const scopes =  ['email', 'profile']
        const authUrl = await googleOAuthClient.createAuthorizationURL(state, codeVerifier, scopes)
        return {success: true, url: authUrl.toString()}

    } catch (error) {
        return {success: false, error:'Something went wrong'}
    }
}