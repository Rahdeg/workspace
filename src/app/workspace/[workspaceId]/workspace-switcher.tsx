"use client"
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useCreateWorkspaceModal } from '@/features/store/use-create-workspace-modal'
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace'
import { useGetWorkspaces } from '@/features/workspaces/api/use-get-workspaces'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { Loader, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

export const WorkspaceSwitcher = () => {

    const workspaceId = useWorkspaceId();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_open, setOpen] = useCreateWorkspaceModal();
    const router = useRouter();

    const { data: workspaces, isLoading: workspacesLoading } = useGetWorkspaces();
    const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({ id: workspaceId });

    const filteredWorkspaces = workspaces?.filter((workspace) => workspace._id !== workspaceId);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className=' size-9 relative overflow-hidden bg-[#ABABAD] hover:bg-[#ABABAD]/80 text-slate-800 font-semibold text-xl'>
                    {
                        workspaceLoading ? (
                            <Loader className=' size-5 animate-spin  shrink-0' />
                        ) : (
                            workspace?.name.charAt(0).toUpperCase()
                        )
                    }
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side='bottom' align='start' className='w-64'>
                <DropdownMenuItem
                    onClick={() => router.push(`/workspace/${workspaceId}`)}
                    className=' cursor-pointer flex-col justify-start items-start capitalize'>
                    {workspace?.name}
                    <span className=' text-xs text-muted-foreground'>
                        Active workspace
                    </span>
                </DropdownMenuItem>
                {
                    filteredWorkspaces?.map((workspace) => (
                        <DropdownMenuItem key={workspace._id}
                            className=' cursor-pointer capitalize'
                            onClick={() => router.push(`/workspace/${workspace._id}`)}
                        >
                            <div className='size-9 relative overflow-hidden bg-[#616061] text-slate-800 font-semibold text-lg rounded-md flex items-center justify-center mr-2'>
                                {workspace?.name.charAt(0).toUpperCase()}
                            </div>
                            <p className=' truncate'>{workspace?.name}</p>
                        </DropdownMenuItem>
                    ))
                }
                <DropdownMenuItem className='cursor-pointer' onClick={() => setOpen(true)}>
                    <div className=' size-9 relative overflow-hidden bg-[#f2f2f2] text-slate-800 font-semibold text-lg rounded-md flex items-center justify-center mr-2 '>
                        <Plus />
                    </div>
                    Create a new workspace
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}