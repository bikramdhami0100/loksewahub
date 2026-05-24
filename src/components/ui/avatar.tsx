"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  name?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
};

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, name, size = "md", ...props }, ref) => {
    if (src) {
      return (
        <div
          ref={ref}
          className={cn("relative overflow-hidden rounded-full", sizeClasses[size], className)}
          {...props}
        >
          <img src={src} alt={name || "Avatar"} className="h-full w-full object-cover" />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center rounded-full bg-primary/10 font-medium text-primary",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {name ? getInitials(name) : "U"}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";

export { Avatar };
