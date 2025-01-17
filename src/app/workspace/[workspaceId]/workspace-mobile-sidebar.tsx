import { useCurrentMember } from '@/features/members/api/use-current-member';
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace';
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { AlertTriangle, HashIcon, Loader, MessageSquareText, SendHorizonal } from 'lucide-react';
import React from 'react'
import { WorkspaceHeader } from './workspace-header';
import { SidebarItem } from './sidebar-item';
import { useGetChannels } from '@/features/channels/api/use-get-channels';
import { WorkspaceSection } from './workspace-section';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { UserItem } from './user-item';
import { useCreateChannelModal } from '@/features/channels/store/use-create-channel-modal';
import { useChannelId } from '@/hooks/use-channel-id';
import { useMemberId } from '@/hooks/use-member-id';
import { usePathname } from 'next/navigation';

interface WorkspaceMobileSidebarProps {
    onClick?: () => void;
}


export const WorkspaceMobileSidebar = ({ onClick }: WorkspaceMobileSidebarProps) => {
    const workspaceId = useWorkspaceId();
    const channelId = useChannelId();
    const memberId = useMemberId();

    const pathname = usePathname();


    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_open, setOpen] = useCreateChannelModal();

    const { data: member, isLoading: memberLoading } = useCurrentMember({ workspaceId });
    const { data: channels, isLoading: channelsLoading } = useGetChannels({ workspaceId });
    const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({ id: workspaceId });
    const { data: members, isLoading: membersLoading } = useGetMembers({ workspaceId });

    const loading = workspaceLoading || memberLoading || channelsLoading || membersLoading;
    const noData = !workspace || !member;

    if (loading) {
        return (
            <div className=' flex flex-col bg-[#5E2C5F] h-full items-center justify-center'>
                <Loader className=' size-5 animate-spin text-white' />
            </div>
        )
    }

    if (noData) {
        return (
            <div className=' flex flex-col bg-[#5E2C5F] h-full items-center justify-center'>
                <AlertTriangle className=' size-5  text-white' />
                <p className=' text-white text-sm'>
                    Workspace not found
                </p>
            </div>
        )
    }



    return (
        <div className='flex flex-col bg-[#5E2C5F] h-full '>
            <WorkspaceHeader workspace={workspace} isAdmin={member.role === "admin"} />
            <div className=' flex flex-col px-2 mt-3' onClick={onClick}>
                <SidebarItem label='Threads' icon={MessageSquareText} isThread
                    variant={pathname.includes("thread") ? "active" : "default"}
                />
                <SidebarItem label='Drafts & Sent' icon={SendHorizonal} isDraft
                    variant={pathname.includes("draft") ? "active" : "default"} />
                <WorkspaceSection
                    label="Channels"
                    hint="New Channel"
                    onNew={member.role === "admin" ? () => setOpen(true) : undefined}
                >
                    {
                        channels?.map((item) => (
                            <SidebarItem key={item._id} label={item.name} icon={HashIcon} id={item._id}
                                variant={channelId === item._id ? "active" : "default"}
                            />
                        ))
                    }
                </WorkspaceSection>
                <WorkspaceSection
                    label="Direct Messages"
                    hint="New direct message"
                    onNew={() => { }}
                >
                    {
                        members?.map((item) => (
                            <UserItem
                                key={item._id}
                                id={item._id}
                                image={item.user.image}
                                label={item.user.name}
                                variant={item._id === memberId ? "active" : "default"}

                            />
                        ))
                    }
                </WorkspaceSection>


            </div>

        </div>
    )
}
