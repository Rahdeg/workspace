import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { CodeInput } from "./code-input";
import { SignInWithEmailCode } from "./SignInWithEmailCode";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ResetPasswordWithEmailCode({
    handleCancel,
    provider,
}: {
    handleCancel: () => void;
    provider: string;
}) {
    const { signIn } = useAuthActions();
    const [step, setStep] = useState<"forgot" | { email: string }>("forgot");
    const [submitting, setSubmitting] = useState(false);
    return step === "forgot" ? (
        <Card className=' w-full h-full p-8'>
            <CardHeader className='px-0 pt-0'>
                <CardTitle>
                    Send password reset code
                </CardTitle>

            </CardHeader>
            <CardContent className=' space-y-5 px-0 pb-0'>
                <SignInWithEmailCode
                    handleCodeSent={(email) => setStep({ email })}
                    provider={provider}
                >
                    <input name="flow" type="hidden" value="reset" />
                </SignInWithEmailCode>
                <Button type="button" variant="link" onClick={handleCancel}>
                    Cancel
                </Button>
            </CardContent>


        </Card>
    ) : (
        <Card className=' w-full h-full p-8'>
            <CardHeader className='px-0 pt-0'>
                <CardTitle>
                    Check your email
                </CardTitle>

                <CardDescription>
                    <p className="text-muted-foreground text-sm">
                        Enter the 8-digit code we sent to your email address and choose a new
                        password.
                    </p>
                </CardDescription>

            </CardHeader>
            <CardContent className=' space-y-5 px-0 pb-0'>
                <form
                    className="flex flex-col"
                    onSubmit={(event) => {
                        event.preventDefault();
                        setSubmitting(true);
                        const formData = new FormData(event.currentTarget);
                        signIn(provider, formData).catch((error) => {
                            console.error(error);


                            setSubmitting(false);
                        });
                    }}
                >
                    <label htmlFor="email">Code</label>
                    <CodeInput />
                    <label htmlFor="newPassword">New Password</label>
                    <Input
                        type="password"
                        name="newPassword"
                        id="newPassword"
                        className="mb-4 "
                        autoComplete="new-password"
                    />
                    <input type="hidden" name="flow" value="reset-verification" />
                    <input type="hidden" name="email" value={step.email} />
                    <Button type="submit" disabled={submitting}>
                        Continue
                    </Button>
                    <Button type="button" variant="link" onClick={() => setStep("forgot")}>
                        Cancel
                    </Button>
                </form>
            </CardContent>


        </Card>
    );
}