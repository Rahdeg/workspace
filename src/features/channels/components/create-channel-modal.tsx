import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";


import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useCreateChannelModal } from "../store/use-create-channel-modal";
import { useCreateChannel } from "../api/use-create-channel";
import { useWorkspaceId } from "@/hooks/use-workspace-id";


export const CreateChannelModal = () => {
    const [open, setOpen] = useCreateChannelModal();
    const [name, setName] = useState("");
    const router = useRouter()

    const workspaceId = useWorkspaceId();


    const { mutate, isPending } = useCreateChannel();

    const handleClose = () => {
        setOpen(false);
        setName("");
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
        setName(value);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        mutate({
            workspaceId,
            name
        }, {
            onSuccess(id) {
                toast.success("Channel created");
                router.push(`/workspace/${workspaceId}/channel/${id}`);
                handleClose();
            },
            onError: () => {
                toast.error("Failed to create channel")
            },
            onSettled: () => {
                //Reset form
            }
        })
    }


    return (
        <Dialog open={open} onOpenChange={handleClose} >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className=" text-black">Add a channel</DialogTitle>
                </DialogHeader>
                <form className=" space-y-4" onSubmit={handleSubmit}>
                    <Input
                        className=" text-black"
                        value={name}
                        disabled={isPending}
                        onChange={handleChange}
                        required
                        autoFocus
                        minLength={3}
                        maxLength={80}
                        placeholder="e.g. plan-budget "
                    />
                    <div className=" flex justify-end">
                        <Button disabled={isPending}>
                            Create
                        </Button>
                    </div>
                </form>
            </DialogContent>

        </Dialog>
    )
}
