"use client"
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRemoveWorkspace } from "@/features/workspaces/api/use-remove-workspace";
import { useUpdateWorkspace } from "@/features/workspaces/api/use-update-workspace";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";

interface PreferenceModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    initialvalue: string;
}

export const PreferenceModal = ({ setOpen, initialvalue, open }: PreferenceModalProps) => {

    const [value, setValue] = useState(initialvalue);
    const [editMode, setEditMode] = useState(false);

    const workspaceId = useWorkspaceId();

    const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } = useUpdateWorkspace();
    const { mutate: removeWorkspace, isPending: isRemovingWorkspace } = useRemoveWorkspace();

    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure?",
        "You are about to delete this workspace"
    )

    const handleRemove = async () => {
        const ok = await confirm();

        if (ok) {
            removeWorkspace({ id: workspaceId }, {
                onSuccess: () => {
                    onChange();
                    toast.success("Workspace Removed")
                },
                onError: () => {
                    toast.error("Failed to remove workspace")
                }
            })
        }


    }

    const handleEdit = () => {
        updateWorkspace({ id: workspaceId, name: value }, {
            onSuccess: () => {
                onChange();
                toast.success("Workspace updated")
            },
            onError: () => {
                toast.error("Failed to update workspace")
            }
        })

    }

    const onChange = () => {
        if (editMode) {
            setEditMode(false);
        }

        setOpen(false);
    }

    return (
        <>
            <ConfirmDialog />
            <Dialog open={open} onOpenChange={onChange}>
                <DialogContent className=" p-0 bg-gray-50 overflow-hidden">
                    <DialogHeader className="p-4 border-b bg-white">
                        <DialogTitle>
                            {editMode ? "Rename this workspace" : value}
                        </DialogTitle>
                    </DialogHeader>
                    <div className=" px-4 pb-4 flex flex-col gap-y-2">
                        {
                            editMode ? (
                                <Input value={value} onChange={(e) => setValue(e.target.value)} required minLength={3} maxLength={80} placeholder="Workspace name e.g.'Work' " disabled={isUpdatingWorkspace} />

                            ) : (
                                <div className=" px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                                    <div className=" flex items-center justify-between">
                                        <p className=" text-sm font-semibold">
                                            Workspace name
                                        </p>
                                        <p className=" text-sm text-[#1264a3] hover:underline font-semibold" onClick={() => setEditMode(true)}>
                                            Edit
                                        </p>
                                    </div>
                                    <p className=" text-sm">
                                        {value}
                                    </p>
                                </div>
                            )
                        }

                        {editMode ? (
                            <div className=" flex items-center justify-end gap-x-2">
                                <Button className=" " variant="outline" onClick={onChange} disabled={isUpdatingWorkspace}>
                                    cancel
                                </Button>
                                <Button className=" " variant="default" onClick={handleEdit} disabled={isUpdatingWorkspace}>
                                    Save
                                </Button>
                            </div>

                        ) : (
                            <button disabled={isRemovingWorkspace} onClick={handleRemove} className=" flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600">
                                <TrashIcon className=" size-4" />
                                <p className=" text-sm font-semibold">Delete workspace</p>
                            </button>
                        )

                        }




                    </div>
                </DialogContent>
            </Dialog>
        </>

    )
}
