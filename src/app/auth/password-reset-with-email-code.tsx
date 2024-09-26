import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { CodeInput } from "@/features/auth/components/code-input";
import { SignInWithEmailCode } from "@/features/auth/components/SignInWithEmailCode";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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
        <Card className="p-0">

            <CardHeader className=''>
                <CardTitle>
                    Send password reset code
                </CardTitle>
                <CardDescription>
                    Use your  email to reset your password
                </CardDescription>
            </CardHeader>

            <CardContent>
                <SignInWithEmailCode
                    handleCodeSent={(email) => setStep({ email })}
                    provider={provider}
                >
                    <input name="flow" type="hidden" value="reset" />
                </SignInWithEmailCode>
            </CardContent>
            <CardFooter>
                <Button type="button" variant="outline" onClick={handleCancel} className="w-full">
                    Cancel
                </Button>
            </CardFooter>

        </Card>
    ) : (
        <Card className="p-0">
            <CardHeader className=''>
                <CardTitle>
                    Check your email
                </CardTitle>
                <CardDescription>
                    Enter the 8-digit code we sent to your email address and choose a new
                    password.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form
                    className="flex flex-col"
                    onSubmit={(event) => {
                        event.preventDefault();
                        setSubmitting(true);
                        const formData = new FormData(event.currentTarget);
                        signIn(provider, formData).catch((error) => {
                            console.error(error);
                            toast.error("Code could not be verified or new password is too short, try again");
                            setSubmitting(false);
                        });
                    }}
                >
                    <label htmlFor="email" className=" my-2 font-bold">Code</label>
                    <CodeInput />
                    <label htmlFor="newPassword" className=" my-2 font-bold">New Password</label>
                    <Input
                        type="password"
                        name="newPassword"
                        id="newPassword"
                        className="mb-4  "
                        autoComplete="new-password"
                    />
                    <input type="hidden" name="flow" value="reset-verification" />
                    <input type="hidden" name="email" value={step.email} />
                    <Button type="submit" disabled={submitting}>
                        Continue
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setStep("forgot")} className="mt-2">
                        Cancel
                    </Button>
                </form>
            </CardContent>

        </Card>
    );
}