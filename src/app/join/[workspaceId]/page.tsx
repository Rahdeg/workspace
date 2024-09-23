"use client"
import VerificationInput from "react-verification-input"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { useGetWorkspaceInfo } from "@/features/workspaces/api/use-get-workspace-info"
import { Loader } from "lucide-react"
import { useJoin } from "@/features/workspaces/api/use-join"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useEffect, useMemo } from "react"

const JoinPage = () => {
    const workspaceId = useWorkspaceId();
    const router = useRouter();

    const { data, isLoading } = useGetWorkspaceInfo({ id: workspaceId });
    const { mutate, isPending } = useJoin();

    const isMember = useMemo(() => data?.isMember, [data?.isMember]);

    useEffect(() => {
        if (isMember) {
            router.push(`/workspace/${workspaceId}`)
        }


    }, [isMember, router, workspaceId])


    const handleComplete = (value: string) => {
        mutate({ workspaceId, joinCode: value }, {
            onSuccess: (id) => {
                router.replace(`/workspace/${id}`);
                toast.success("Workspace joined.");
            },
            onError: () => {
                toast.error("Failed to join workspace.");
            }
        })
    }

    if (isLoading) {
        return (
            <div className=" h-full flex items-center justify-center">
                <Loader className=" size-6 animate-spin text-muted-foreground" />
            </div>
        )
    }


    return (
        <div className=" h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-lg shadow-sm">
            <Image src="/slack.png" alt="logo" width={60} height={60} />
            <div className=" flex flex-col gap-y-4 items-center justify-center max-w-md">
                <div className="flex flex-col gap-y-2 items-center justify-center">
                    <h1 className=" text-2xl font-bold">
                        Join {data?.name}
                    </h1>
                    <p className=" text-md text-muted-foreground">
                        Enter the workspace code to join
                    </p>

                </div>
                <VerificationInput
                    onComplete={handleComplete}
                    length={6}
                    autoFocus
                    classNames={{
                        container: cn("flex gap-x-2", isPending && "opacity-50 cursor-50 cursor-not-allowed"),
                        character: "uppercase h-auto rounded-md border border-gray-300 flex items-center justify-center text-lg font-medium text-gray-500",
                        characterInactive: "bg-muted",
                        characterSelected: "bg-white text-black font-bold",
                        characterFilled: "bg-white text-black font-bold"
                    }}
                />
            </div>
            <div className=" flex gap-x-4">
                <Button asChild size="lg" variant="outline" disabled={isPending}>
                    <Link href="/">
                        Back to home
                    </Link>
                </Button>

            </div>
        </div>
    )
}

export default JoinPage