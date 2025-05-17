import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: number;
    max?: number;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
    ({ className, value = 0, max = 100, ...props }, ref) => {
        const percentage =
            value && max ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

        return (
            <div
                ref={ref}
                className={cn(
                    "relative h-2 w-full overflow-hidden rounded-full bg-gray-100",
                    className
                )}
                {...props}
            >
                <div
                    className="h-full w-full flex-1 bg-cyan-500 transition-all"
                    style={{ transform: `translateX(-${100 - percentage}%)` }}
                />
            </div>
        );
    }
);
Progress.displayName = "Progress";

export { Progress };
