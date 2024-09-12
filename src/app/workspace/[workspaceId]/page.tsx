'use client'
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace';
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import React from 'react'


// interface WorkspaceIdPageProps {
//     params: {
//         workspaceId: string
//     }
// }

const WorkspaceIdPage = () => {
    const workspaceId = useWorkspaceId();

    const { data } = useGetWorkspace({ id: workspaceId });

    return (
        <div className=''>
            ID: {JSON.stringify(data)}
        </div>
    )
}

export default WorkspaceIdPage