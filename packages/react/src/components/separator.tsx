"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "../lib/utils";

function Separator({
    className,
    orientation = "horizontal",
    decorative = true,
    ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
    return (
        <SeparatorPrimitive.Root
            data-slot="separator-root"
            decorative={decorative}
            orientation={orientation}
            className={cn(
                "borg-separator",
                orientation === "horizontal"
                    ? "borg-separator--horizontal"
                    : "borg-separator--vertical",
                className,
            )}
            {...props}
        />
    );
}

export { Separator };
