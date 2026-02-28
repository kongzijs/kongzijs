import * as React from "react";
import { LucideIcon, Zap } from "lucide-react";
import { cn } from "../lib/utils";

export interface CardToggleProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    description?: string;
    icon?: LucideIcon;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    disabled?: boolean;
    variant?: "default" | "success" | "warning" | "destructive";
}

export function CardToggle({
    className,
    title,
    description,
    icon: Icon = Zap,
    checked,
    onCheckedChange,
    disabled = false,
    variant = "success",
    ...props
}: CardToggleProps) {
    return (
        <div
            data-slot="card-toggle"
            data-state={checked ? "checked" : "unchecked"}
            data-variant={variant}
            data-disabled={disabled ? "" : undefined}
            role="checkbox"
            aria-checked={checked}
            tabIndex={disabled ? -1 : 0}
            onClick={() => !disabled && onCheckedChange(!checked)}
            onKeyDown={(e) => {
                if (!disabled && (e.key === " " || e.key === "Enter")) {
                    e.preventDefault();
                    onCheckedChange(!checked);
                }
            }}
            className={cn("borg-card-toggle", className)}
            {...props}
        >
            <div className="borg-card-toggle-icon">
                <Icon size={16} />
            </div>
            <div className="borg-card-toggle-content">
                <span className="borg-card-toggle-title">{title}</span>
                {description && (
                    <span className="borg-card-toggle-desc">{description}</span>
                )}
            </div>
            <div className="borg-card-toggle-switch">
                <div className="borg-card-toggle-thumb" />
            </div>
        </div>
    );
}
