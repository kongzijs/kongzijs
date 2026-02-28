import * as React from "react";
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";

import { cn } from "../lib/utils";

function AspectRatio({
    ...props
}: React.ComponentProps<typeof AspectRatioPrimitive.Root>) {
    return (
        <AspectRatioPrimitive.Root
            data-slot="aspect-ratio"
            className={cn("borg-aspect-ratio", props.className)}
            {...props}
        />
    );
}

export { AspectRatio };
