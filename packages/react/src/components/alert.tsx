import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";

const alertVariants = cva("borg-alert", {
    variants: {
        variant: {
            default: "borg-alert--default",
            destructive: "borg-alert--destructive",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});

function Alert({
    className,
    variant,
    ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
    return (
        <div
            data-slot="alert"
            role="alert"
            className={cn(alertVariants({ variant }), className)}
            {...props}
        />
    );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="alert-title"
            className={cn("borg-alert__title", className)}
            {...props}
        />
    );
}

function AlertDescription({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="alert-description"
            className={cn("borg-alert__description", className)}
            {...props}
        />
    );
}

export { Alert, AlertTitle, AlertDescription };
