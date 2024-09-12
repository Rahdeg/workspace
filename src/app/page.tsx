"use client"
import { UserButton } from "@/features/auth/components/user-button";
import { useCreateWorkspaceModal } from "@/features/store/use-create-workspace-modal";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";


export default function Home() {

  const [open, setOpen] = useCreateWorkspaceModal();

  const router = useRouter();

  const { data, isLoading } = useGetWorkspaces();

  const workspaceId = useMemo(() => data?.[0]?._id, [data]);


  useEffect(() => {
    if (isLoading) return;
    if (workspaceId) {
      router.replace(`/workspace/${workspaceId}`)
    } else if (!open) {
      setOpen(true);
    }

  }, [workspaceId, isLoading, open, setOpen, router])




  return (
    <div className=" flex items-center justify-center h-full  bg-red-600 gap-x-2">
      Logged In!

      <UserButton />
    </div>
  );
}


