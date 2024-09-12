import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { useCreateWorkspaceModal } from "@/features/store/use-create-workspace-modal"
import { useCreateWorkspace } from "../api/use-create-workspace";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";


export const CreateWorkspaceModal = () => {
    const [open, setOpen] = useCreateWorkspaceModal();
    const [name, setName] = useState("");
    const router = useRouter()


    const { mutate, isPending } = useCreateWorkspace();

    const handleClose = () => {
        setOpen(false);
        setName("");
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        mutate({
            name
        }, {
            onSuccess(id) {
                toast.success("Workspace created");
                router.push(`/workspace/${id}`);
                handleClose();
            },
            onError: () => {
                //Show toast Error
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
                    <DialogTitle className=" text-black">Add a workspace</DialogTitle>
                </DialogHeader>
                <form className=" space-y-4" onSubmit={handleSubmit}>
                    <Input
                        className=" text-black"
                        value={name}
                        disabled={isPending}
                        onChange={(e) => setName(e.target.value)}
                        required
                        autoFocus
                        minLength={3}
                        placeholder="Workspace name e.g  'Work','Personal', 'Home "
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
