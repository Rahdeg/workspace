"use client"

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"


import { Button } from '@/components/ui/button'
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { Home, Info, Search, Workflow } from 'lucide-react'
import React, { useState } from 'react'
import { useGetChannels } from "@/features/channels/api/use-get-channels"
import { useGetMembers } from "@/features/members/api/use-get-members"
import { useRouter } from "next/navigation"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { MobileSidebar } from "./mobile-sidebar"
import { WorkspaceMobileSidebar } from "./workspace-mobile-sidebar"
import { useMedia } from "react-use"

export const Toolbar = () => {
    const workspaceId = useWorkspaceId();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);

    const { data } = useGetWorkspace({ id: workspaceId });

    const { data: channels } = useGetChannels({ workspaceId });
    const { data: members } = useGetMembers({ workspaceId })

    const isMobile = useMedia("(max-width: 760px)", false);

    const onChannelClick = (channelId: string) => {
        setOpen(false);
        router.push(`/workspace/${workspaceId}/channel/${channelId}`)
    }

    const onMemberClick = (memberId: string) => {
        setOpen(false);
        router.push(`/workspace/${workspaceId}/member/${memberId}`)
    }

    const onClick = () => {
        setIsOpen(false);
    }

    const onWorkspaceClick = () => {
        setIsWorkspaceOpen(false);
    }

    return (
        <div className=' bg-[#481349] flex items-center justify-between h-10 p-1.5'>
            {
                isMobile ? (<div className="flex-1 ">
                    <Sheet open={isOpen} onOpenChange={setIsOpen} >
                        <SheetTrigger asChild>
                            <Button variant="outline" size="sm" className=' font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition'>
                                <Home className=' size-4' />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className='w-[90px] h-screen bg-[#481349] p-0 '>
                            <MobileSidebar onClick={onClick} />
                        </SheetContent>
                    </Sheet>
                </div>) : (<div className=' flex-1' />)
            }


            <div className=' lg:min-w-[280px] lg:max-[642px] grow-[2] shrink'>
                <Button size="sm" className=' bg-accent/25 hover:bg-accent/25 w-full justify-start h-7 px-2' onClick={() => setOpen(true)}>
                    <Search className=' size-4 text-white mr-2' />
                    <span className='text-white text-xs'>
                        Search {data?.name}
                    </span>

                </Button>
                <CommandDialog open={open} onOpenChange={setOpen}>
                    <CommandInput placeholder="Type a command or search..." />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup heading="Channels">
                            {
                                channels?.map((channel) => (
                                    <CommandItem key={channel._id} onSelect={() => onChannelClick(channel._id)}>

                                        {channel.name}
                                    </CommandItem>
                                ))
                            }
                        </CommandGroup>
                        <CommandSeparator />
                        <CommandGroup heading="Members">
                            {
                                members?.map((member) => (
                                    <CommandItem key={member._id} onSelect={() => onMemberClick(member._id)}>

                                        {member.user.name}


                                    </CommandItem>
                                ))
                            }
                        </CommandGroup>
                    </CommandList>
                </CommandDialog>
            </div>
            <div className=' ml-auto flex-1 hidden lg:flex items-center justify-end'>
                <Button variant="transparent" className="">
                    <Info className=' size-5 text-white' />
                </Button>
            </div>
            <div className="ml-auto flex flex-1  lg:hidden items-center justify-end">
                <Sheet open={isWorkspaceOpen} onOpenChange={setIsWorkspaceOpen} >
                    <SheetTrigger asChild>
                        <Button variant="transparent" className="flex lg:hidden">
                            <Workflow className=' size-5 text-white' />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className='w-full h-full bg-[#481349] p-0 pr-4'>
                        <WorkspaceMobileSidebar onClick={onWorkspaceClick} />
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    )
}
