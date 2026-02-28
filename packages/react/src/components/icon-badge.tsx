import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { LucideIcon } from "lucide-react";

const iconBadgeVariants = cva("borg-icon-badge", {
    variants: {
        variant: {
            default: "borg-icon-badge--default",
            primary: "borg-icon-badge--primary",
            orange: "borg-icon-badge--orange",
            green: "borg-icon-badge--green",
        },
        size: {
            sm: "borg-icon-badge--size-sm",
            default: "borg-icon-badge--size-default",
            lg: "borg-icon-badge--size-lg",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "default",
    },
});

export interface IconBadgeProps
    extends
        React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof iconBadgeVariants> {
    icon: LucideIcon;
    iconSize?: number;
}

export function IconBadge({
    className,
    variant,
    size,
    icon: Icon,
    iconSize = 16,
    ...props
}: IconBadgeProps) {
    return (
        <div
            className={cn(iconBadgeVariants({ variant, size, className }))}
            {...props}
        >
            <Icon size={iconSize} />
        </div>
    );
}
