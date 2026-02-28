"use client";

import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";

const toggleVariants = cva("borg-toggle", {
    variants: {
        variant: {
            default: "borg-toggle--default",
            outline: "borg-toggle--outline",
        },
        size: {
            default: "borg-toggle--size-default",
            sm: "borg-toggle--size-sm",
            lg: "borg-toggle--size-lg",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "default",
    },
});

function Toggle({
    className,
    variant,
    size,
    ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>) {
    return (
        <TogglePrimitive.Root
            data-slot="toggle"
            className={cn(toggleVariants({ variant, size, className }))}
            {...props}
        />
    );
}

export { Toggle, toggleVariants };
