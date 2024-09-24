import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { IconType } from "react-icons/lib";

const sidebarItemVariants = cva(
    "flex items-center gap-1.5 justify-start font-normal h-7 px-[18px] text-sm overflow-hidden",
    {
        variants: {
            variant: {
                default: "text-[#f9edffcc]",
                active: "text-[#481349] bg-white/90 hover:bg-white/90"
            }
        },
        defaultVariants: {
            variant: "default"
        }
    }
)

interface SidebarItemProps {
    label: string;
    id?: string;
    isThread?: boolean;
    isDraft?: boolean;
    icon: LucideIcon | IconType;
    onClick?: () => void;
    variant?: VariantProps<typeof sidebarItemVariants>["variant"];
}

export const SidebarItem = ({ label, id, icon: Icon, variant, isDraft, isThread, onClick }: SidebarItemProps) => {

    const workspaceId = useWorkspaceId();

    if (isThread) {
        return (
            <Button asChild variant="transparent" size="sm" className={cn(sidebarItemVariants({ variant: variant }))} onClick={onClick}>
                <Link href={`/workspace/${workspaceId}/thread`}>
                    <Icon className=" size-3.5 mr-1 shrink-0" />
                    <span className=" text-sm truncate">{label} </span>
                </Link>
            </Button>

        )
    }

    if (isDraft) {
        return (
            <Button asChild variant="transparent" size="sm" className={cn(sidebarItemVariants({ variant: variant }))} onClick={onClick}>
                <Link href={`/workspace/${workspaceId}/draft`}>
                    <Icon className=" size-3.5 mr-1 shrink-0" />
                    <span className=" text-sm truncate">{label} </span>
                </Link>
            </Button>

        )
    }


    return (
        <Button asChild variant="transparent" size="sm" className={cn(sidebarItemVariants({ variant: variant }))}>

            <Link href={`/workspace/${workspaceId}/channel/${id}`}>
                <Icon className=" size-3.5 mr-1 shrink-0" />
                <span className=" text-sm truncate">{label} </span>
            </Link>

        </Button>
    )
}
