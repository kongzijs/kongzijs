"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "../lib/utils";

function Slider({
    className,
    defaultValue,
    value,
    min = 0,
    max = 100,
    ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
    const _values = React.useMemo(
        () =>
            Array.isArray(value)
                ? value
                : Array.isArray(defaultValue)
                  ? defaultValue
                  : [min, max],
        [value, defaultValue, min, max],
    );

    return (
        <SliderPrimitive.Root
            data-slot="slider"
            defaultValue={defaultValue}
            value={value}
            min={min}
            max={max}
            className={cn("borg-slider", className)}
            {...props}
        >
            <SliderPrimitive.Track
                className="borg-slider-track"
                data-slot="slider-track"
            >
                <SliderPrimitive.Range
                    className="borg-slider-range"
                    data-slot="slider-range"
                />
            </SliderPrimitive.Track>
            {Array.from({ length: _values.length }, (_, index) => (
                <SliderPrimitive.Thumb
                    className="borg-slider-thumb"
                    data-slot="slider-thumb"
                    key={index}
                />
            ))}
        </SliderPrimitive.Root>
    );
}

export { Slider };
