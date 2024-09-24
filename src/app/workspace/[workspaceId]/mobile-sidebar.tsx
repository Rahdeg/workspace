"use client"
import { UserButton } from '@/features/auth/components/user-button'
import React from 'react'
import { WorkspaceSwitcher } from './workspace-switcher'
import { SidebarButton } from './sidebar-button'
import { Bell, Home, MessageSquare, MoreHorizontal } from 'lucide-react'
import { usePathname } from 'next/navigation'


interface MobileSidebarProps {
    onClick: () => void;
}

export const MobileSidebar = ({ onClick }: MobileSidebarProps) => {
    const pathname = usePathname();
    return (
        <aside className=' w-[70px] h-screen bg-[#481349] flex flex-col gap-y-4 items-center  pt-[9px] pb-4 mt-8'>
            <WorkspaceSwitcher />
            <SidebarButton
                icon={Home}
                label='Home'
                isActive={pathname.includes("/workspace")}
                onClick={onClick}
            />
            <SidebarButton
                icon={MessageSquare}
                label='DMs'
                onClick={onClick}
            />
            <SidebarButton
                icon={Bell}
                label='Activities'
                onClick={onClick}
            />

            <SidebarButton
                icon={MoreHorizontal}
                label='More'
                onClick={onClick}
            />


            <UserButton />

        </aside>
    )
}
