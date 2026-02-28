import type { ComponentPropsWithoutRef } from "react";

import { cn } from "../lib/utils";

function Card({ className, ...props }: ComponentPropsWithoutRef<"div">) {
    return (
        <div
            data-slot="card"
            className={cn("borg-card", className)}
            {...props}
        />
    );
}

function CardHeader({ className, ...props }: ComponentPropsWithoutRef<"div">) {
    return (
        <div
            data-slot="card-header"
            className={cn("borg-card__header", className)}
            {...props}
        />
    );
}

function CardTitle({ className, ...props }: ComponentPropsWithoutRef<"h4">) {
    return (
        <h4
            data-slot="card-title"
            className={cn("borg-card__title", className)}
            {...props}
        />
    );
}

function CardDescription({
    className,
    ...props
}: ComponentPropsWithoutRef<"p">) {
    return (
        <p
            data-slot="card-description"
            className={cn("borg-card__description", className)}
            {...props}
        />
    );
}

function CardAction({ className, ...props }: ComponentPropsWithoutRef<"div">) {
    return (
        <div
            data-slot="card-action"
            className={cn("borg-card__action", className)}
            {...props}
        />
    );
}

function CardContent({ className, ...props }: ComponentPropsWithoutRef<"div">) {
    return (
        <div
            data-slot="card-content"
            className={cn("borg-card__content", className)}
            {...props}
        />
    );
}

function CardFooter({ className, ...props }: ComponentPropsWithoutRef<"div">) {
    return (
        <div
            data-slot="card-footer"
            className={cn("borg-card__footer", className)}
            {...props}
        />
    );
}

export {
    Card,
    CardHeader,
    CardFooter,
    CardTitle,
    CardAction,
    CardDescription,
    CardContent,
};
