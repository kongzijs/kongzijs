"use client";

import * as React from "react";
import { GripVerticalIcon } from "lucide-react";
import * as ResizablePrimitive from "react-resizable-panels";

import { cn } from "../lib/utils";

function ResizablePanelGroup({
    className,
    ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) {
    return (
        <ResizablePrimitive.PanelGroup
            data-slot="resizable-panel-group"
            className={cn(
                "borg-flex borg-h-full borg-w-full data-[panel-group-direction=vertical]:borg-flex-col",
                className,
            )}
            {...props}
        />
    );
}

function ResizablePanel({
    ...props
}: React.ComponentProps<typeof ResizablePrimitive.Panel>) {
    return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />;
}

function ResizableHandle({
    withHandle,
    className,
    ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
    withHandle?: boolean;
}) {
    return (
        <ResizablePrimitive.PanelResizeHandle
            data-slot="resizable-handle"
            className={cn("borg-resizable-handle", className)}
            {...props}
        >
            {withHandle && (
                <div className="borg-z-10 borg-flex borg-h-4 borg-w-3 borg-items-center borg-justify-center borg-border borg-rounded-xs borg-bg-border">
                    <GripVerticalIcon className="borg-size-2.5" />
                </div>
            )}
        </ResizablePrimitive.PanelResizeHandle>
    );
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
