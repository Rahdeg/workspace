/* eslint-disable @typescript-eslint/no-unused-vars */
import { format, isToday, isYesterday } from "date-fns";
import { Doc, Id } from "../../convex/_generated/dataModel";
import dynamic from "next/dynamic";
import { Hint } from "./hint";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Thumbnail } from "./thumbnail";
import { Toolbar } from "./toolbar";
import { useUpdateMessage } from "@/features/messages/api/use-update-message";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRemoveMessage } from "@/features/messages/api/use-remove-message";
import { useConfirm } from "@/hooks/use-confirm";
import { useToggleReaction } from "@/features/reactions/api/use-toggle-reaction";
import { Reactions } from "./reaction";
import { usePanel } from "@/hooks/use-panel";
import { ThreadBar } from "./thread-bar";


const Renderer = dynamic(() => import("@/components/renderer"), { ssr: false });
const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface MessageProps {
    key?: Id<"messages"> | undefined;
    id: Id<"messages">;
    memberId: Id<"members"> | undefined;
    authorImage?: string;
    label?: string;
    authorName?: string;
    isAuthor: boolean;
    reactions?: Array<Omit<Doc<"reactions">, "memberId"> & {
        count: number;
        memberIds: Id<"members">[];
    }>;
    body?: Doc<"messages">["body"];
    image?: string | null | undefined;
    isEditing: boolean;
    setEditingId: (id: Id<"messages"> | null) => void;
    isCompact?: boolean;
    hideThreadButton: boolean;
    updatedAt: Doc<"messages">["_creationTime"] | undefined;
    createdAt: Doc<"messages">["updatedAt"];
    threadCount?: number;
    threadImage?: string;
    threadname?: string;
    threadTimestamp?: number;
}

const formatFullTime = (date: Date) => {
    return ` ${isToday(date) ? " Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d, yyyy")} at ${format(date, "h:mm:ss a")}`;
}


export const Message = ({ id, isAuthor, threadname, memberId, authorImage, label = "Member", reactions, body, image, createdAt, updatedAt, isCompact, isEditing, setEditingId, hideThreadButton, threadCount, threadImage, threadTimestamp, authorName = "Member" }: MessageProps) => {


    const { parentMessageId, onOpenMessage, onClose, onOpenProfile } = usePanel();

    const { mutate: updateMessage, isPending: isUpdatingMessage } = useUpdateMessage();
    const { mutate: removeMessage, isPending: isRemovingMessage } = useRemoveMessage();
    const { mutate: toggleReaction, isPending: isTogglingReaction } = useToggleReaction();

    const isPending = isUpdatingMessage || isRemovingMessage || isTogglingReaction;

    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure?",
        "You are about to delete this message? This cannot be undone"
    )

    const handleReaction = (value: string) => {

        toggleReaction({ messageId: id, value }, {
            onError: () => {
                toast.error("Failed to toggle reaction")
            }
        })
    }

    const handleUpdate = ({ body }: { body: string }) => {
        updateMessage({ id, body }, {
            onSuccess: () => {
                toast.success("Message updated");
                setEditingId(null);
            },
            onError: () => {
                toast.error("Failed to update message")
            }
        })
    }


    const handleRemoveMessage = async () => {
        const ok = await confirm();

        if (ok) {
            removeMessage({ id }, {
                onSuccess: () => {
                    toast.success("Message deleted");

                    if (parentMessageId === id) {
                        onClose();
                    }
                },
                onError: () => {
                    toast.error("Failed to delete message")
                }
            })
        }

    }


    if (isCompact) {
        return (

            <>
                <ConfirmDialog />
                <div className={cn("flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative", isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]", isRemovingMessage && "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200")}>
                    <div className=" flex items-start gap-2">
                        <Hint label={formatFullTime(new Date(createdAt!))}>
                            <button className=" text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline">
                                {format(new Date(createdAt!), "hh:mm")}
                            </button>
                        </Hint>
                        {
                            isEditing ? (
                                <div className=" w-full h-full">
                                    <Editor
                                        onSubmit={handleUpdate}
                                        disabled={isPending}
                                        defaultValues={JSON.parse(body!)}
                                        onCancel={() => setEditingId(null)}
                                        variant="update"
                                    />
                                </div>
                            ) : (
                                <div className=" flex flex-col w-full">
                                    <Renderer value={body!} />
                                    {
                                        updatedAt ? (
                                            <span className=" text-xs text-muted-foreground">
                                                (edited)
                                            </span>
                                        ) : null
                                    }
                                    <Reactions data={reactions!} onChange={handleReaction} />
                                    <ThreadBar
                                        count={threadCount}
                                        image={threadImage}
                                        timestamp={threadTimestamp}
                                        onClick={() => onOpenMessage(id)}
                                        threadName={threadname}
                                    />
                                </div>
                            )
                        }


                    </div>
                    {
                        !isEditing && (
                            <Toolbar
                                isAuthor={isAuthor}
                                isPending={isPending}
                                handleEdit={() => setEditingId(id!)}
                                handleThread={() => onOpenMessage(id)}
                                handleDelete={handleRemoveMessage}
                                hideThreadButton={hideThreadButton}
                                handleReaction={handleReaction}
                            />
                        )
                    }
                </div>
            </>

        )
    }

    const avatarFallback = authorName?.charAt(0).toUpperCase();

    return (
        <>
            <ConfirmDialog />
            <div
                className={cn("flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative", isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]", isRemovingMessage && "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200")}

            >
                <div className=" flex items-start gap-2">
                    <button onClick={() => onOpenProfile(memberId!)}>
                        <Avatar className=" rounded-md ">
                            <AvatarImage src={authorImage} />
                            <AvatarFallback className="  ">
                                {avatarFallback}
                            </AvatarFallback>
                        </Avatar>
                    </button>
                    {
                        isEditing ? (<div className=" w-full h-full">
                            <Editor
                                onSubmit={handleUpdate}
                                disabled={isPending}
                                defaultValues={JSON.parse(body!)}
                                onCancel={() => setEditingId(null)}
                                variant="update"
                            />
                        </div>) : (
                            <div className=" flex flex-col w-full overflow-hidden">
                                <div className="text-sm">
                                    <button onClick={() => onOpenProfile(memberId!)} className=" font-bold text-primary hover:underline">
                                        {authorName}
                                    </button>
                                    <span>
                                        &nbsp; &nbsp;
                                    </span>
                                    <Hint label={formatFullTime(new Date(createdAt!))}>
                                        <button className=" text-xs text-muted-foreground hover:underline">
                                            {format(new Date(createdAt!), "h:mm a")}
                                        </button>
                                    </Hint>

                                </div>
                                <Renderer value={body!} />
                                <Thumbnail url={image} />
                                {
                                    updatedAt ? (
                                        <span className=" text-xs text-muted-foreground">
                                            (edited)
                                        </span>
                                    ) : null
                                }
                                <Reactions data={reactions!} onChange={handleReaction} />
                                <ThreadBar
                                    count={threadCount}
                                    image={threadImage}
                                    timestamp={threadTimestamp}
                                    onClick={() => onOpenMessage(id)}
                                    threadName={threadname}
                                />
                            </div>
                        )
                    }


                </div>
                {
                    !isEditing && (
                        <Toolbar
                            isAuthor={isAuthor}
                            isPending={isPending}
                            handleEdit={() => setEditingId(id!)}
                            handleThread={() => onOpenMessage(id)}
                            handleDelete={handleRemoveMessage}
                            hideThreadButton={hideThreadButton}
                            handleReaction={handleReaction}
                        />
                    )
                }
            </div>
        </>

    )
}
