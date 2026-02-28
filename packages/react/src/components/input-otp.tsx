"use client";

import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { MinusIcon } from "lucide-react";

import { cn } from "../lib/utils";

function InputOTP({
    className,
    containerClassName,
    ...props
}: React.ComponentProps<typeof OTPInput> & {
    containerClassName?: string;
}) {
    return (
        <OTPInput
            data-slot="input-otp"
            containerClassName={cn("borg-input-otp", containerClassName)}
            className={cn("borg-input-otp-input", className)}
            {...props}
        />
    );
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="input-otp-group"
            className={cn("borg-input-otp-group", className)}
            {...props}
        />
    );
}

function InputOTPSlot({
    index,
    className,
    ...props
}: React.ComponentProps<"div"> & {
    index: number;
}) {
    const inputOTPContext = React.useContext(OTPInputContext);
    const { char, hasFakeCaret, isActive } =
        inputOTPContext?.slots[index] ?? {};

    return (
        <div
            data-slot="input-otp-slot"
            data-active={isActive}
            className={cn(
                "borg-input-otp-slot",
                isActive ? "borg-input-otp-slot--active" : "",
                className,
            )}
            {...props}
        >
            {char}
            {hasFakeCaret && (
                <div className="borg-input-otp-caret">
                    <div className="borg-input-otp-caret-inner" />
                </div>
            )}
        </div>
    );
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="input-otp-separator"
            className="borg-input-otp-separator"
            {...props}
        >
            <MinusIcon />
        </div>
    );
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
