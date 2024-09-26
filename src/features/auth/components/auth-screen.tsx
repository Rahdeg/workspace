"use client";
import React from 'react'
import { useState } from "react";
import { SignInFlow } from "../types";
import { SignUpCard } from './sign-up-card';
import { SignInCard } from './sign-in-card';
import { ResetPasswordWithEmailCode } from '@/app/auth/password-reset-with-email-code';






export const AuthScreen = () => {
    const [state, setState] = useState<SignInFlow>("signIn")

    return (
        <div className="flex items-center justify-center bg-[#5C3B58]  h-full">
            <div className=" md:h-auto  md:w-[420px]">
                {
                    state === 'signIn' ? <SignInCard setState={setState} /> : state === 'signUp' ? <SignUpCard setState={setState} /> : <ResetPasswordWithEmailCode
                        provider="password"
                        handleCancel={() => setState("signIn")}
                    />
                }
            </div>
        </div>
    )
}
