import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRemoveChannel } from "@/features/channels/api/use-remove-channel";
import { useUpdateChannel } from "@/features/channels/api/use-update-channel";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useChannelId } from "@/hooks/use-channel-id";
import { useConfirm } from "@/hooks/use-confirm";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { toast } from "sonner";

interface HeaderProps {
    title: string;
}

export const Header = ({ title }: HeaderProps) => {

    const [value, setValue] = useState(title);
    const [editMode, setEditMode] = useState(false);
    const channelId = useChannelId();
    const workspaceId = useWorkspaceId();
    const router = useRouter();

    const { mutate: updateChannel, isPending: isUpdatingChannel } = useUpdateChannel();
    const { mutate: removeChannel, isPending: isRemovingChannel } = useRemoveChannel();
    const { data: member } = useCurrentMember({ workspaceId });

    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure?",
        "You are about to delete this channel, This action is irreversible"
    )

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
        setValue(value);
    }

    const handleEdit = () => {
        updateChannel({ id: channelId, name: value }, {
            onSuccess: () => {
                onChange();
                toast.success("Channel updated")
            },
            onError: () => {
                toast.error("Failed to update channel")
            }
        })

    }

    const handleEditOpen = () => {
        if (member?.role !== "admin") return;
        setEditMode(true);
    }



    const handleRemove = async () => {
        const ok = await confirm();

        if (ok) {
            removeChannel({ id: channelId }, {
                onSuccess: () => {
                    toast.success("Channel Removed")
                    router.push(`/workspace/${workspaceId}`);
                },
                onError: () => {
                    toast.error("Failed to remove channel")
                }
            })
        }


    }

    const onChange = () => {
        if (editMode) {
            setEditMode(false);
        }
    }

    return (
        <>
            <ConfirmDialog />
            <div className=" bg-white border-b h-[49px] flex items-center px-4 overflow-hidden mt-20 lg:mt-0">
                <Dialog onOpenChange={onChange}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" className=" text-lg font-semibold px-2 overflow-hidden w-auto" size="sm">
                            <span className=" truncate">
                                # {title}
                            </span>
                            <FaChevronDown className=" size-2.5 ml-2" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className=" p-0 bg-gray-50 overflow-hidden">
                        <DialogHeader className=" p-4 border-b bg-white">
                            <DialogTitle>
                                {
                                    editMode ? ("Rename this channel") : (`# ${title}`)
                                }

                            </DialogTitle>
                        </DialogHeader>
                        <div className=" px-4 pb-4 flex flex-col gap-y-2">
                            {
                                editMode ? (
                                    <Input value={value} onChange={handleChange} required minLength={3} maxLength={80} placeholder="Workspace name e.g.'Work' " disabled={false} />

                                ) : (
                                    <div className=" px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                                        <div className=" flex items-center justify-between">
                                            <p className=" text-sm font-semibold">Channel name </p>
                                            {
                                                member?.role === "admin" && (
                                                    <p className=" text-sm text-[#1264a3] hover:underline font-semibold"
                                                        onClick={handleEditOpen}>Edit</p>
                                                )
                                            }

                                        </div>
                                        <p className=" text-sm"># {title} </p>
                                    </div>
                                )
                            }
                            {
                                editMode ? (

                                    <div className=" flex items-center justify-end gap-x-2">
                                        <Button className=" " variant="outline" onClick={() => setEditMode(false)} disabled={isUpdatingChannel}>
                                            cancel
                                        </Button>
                                        <Button className=" " variant="default" onClick={handleEdit} disabled={isUpdatingChannel}>
                                            Save
                                        </Button>
                                    </div>


                                ) : member?.role === "admin" && (

                                    <button className=" flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-50 text-rose-600" onClick={handleRemove} disabled={isRemovingChannel}>
                                        <TrashIcon className="size-4" />
                                        <p className=" text-sm font-semibold">Delete channel</p>
                                    </button>
                                )
                            }


                        </div>

                    </DialogContent>
                </Dialog>


            </div>
        </>

    )
}
