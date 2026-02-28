import * as React from "react";
import { Loader2 } from "lucide-react";

import { Button, buttonVariants } from "./button";
import { type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

export interface ActionButtonProps
    extends
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    isLoading?: boolean;
    children?: React.ReactNode;
}

export const ActionButton = React.forwardRef<
    HTMLButtonElement,
    ActionButtonProps
>(
    (
        { className, variant, size, isLoading, children, disabled, ...props },
        ref,
    ) => {
        return (
            <Button
                className={cn("", className)}
                variant={variant}
                size={size}
                ref={ref}
                disabled={isLoading || disabled}
                {...props}
            >
                {isLoading && (
                    <Loader2 className="borg-mr-2 borg-size-4 borg-animate-spin" />
                )}
                {children}
            </Button>
        );
    },
);
ActionButton.displayName = "ActionButton";
