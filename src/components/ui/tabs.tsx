import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: string;
    onValueChange?: (value: string) => void;
    defaultValue?: string;
    children: React.ReactNode;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
    (
        { className, value, onValueChange, defaultValue, children, ...props },
        ref
    ) => {
        const [selected, setSelected] = React.useState(
            value || defaultValue || ""
        );

        // Cập nhật state khi value từ props thay đổi
        React.useEffect(() => {
            if (value !== undefined) {
                setSelected(value);
            }
        }, [value]);

        // Context để chia sẻ state giữa các component con
        const contextValue = React.useMemo(
            () => ({
                value: selected,
                onValueChange: (newValue: string) => {
                    setSelected(newValue);
                    onValueChange?.(newValue);
                },
            }),
            [selected, onValueChange]
        );

        return (
            <TabsContext.Provider value={contextValue}>
                <div ref={ref} className={cn("w-full", className)} {...props}>
                    {children}
                </div>
            </TabsContext.Provider>
        );
    }
);
Tabs.displayName = "Tabs";

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
    ({ className, children, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "inline-flex h-10 items-center justify-center rounded-md bg-gray-50 p-1 text-gray-500",
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
);
TabsList.displayName = "TabsList";

interface TabsTriggerProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    value: string;
    disabled?: boolean;
    children: React.ReactNode;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
    ({ className, value, disabled, children, ...props }, ref) => {
        const { value: selectedValue, onValueChange } = useTabsContext();
        const isSelected = selectedValue === value;

        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                    isSelected
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900",
                    className
                )}
                onClick={() => onValueChange(value)}
                disabled={disabled}
                {...props}
            >
                {children}
            </button>
        );
    }
);
TabsTrigger.displayName = "TabsTrigger";

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string;
    children: React.ReactNode;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
    ({ className, value, children, ...props }, ref) => {
        const { value: selectedValue } = useTabsContext();
        const isSelected = selectedValue === value;

        if (!isSelected) return null;

        return (
            <div
                ref={ref}
                className={cn(
                    "mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);
TabsContent.displayName = "TabsContent";

// Context để quản lý state
type TabsContextValue = {
    value: string;
    onValueChange: (value: string) => void;
};

const TabsContext = React.createContext<TabsContextValue | undefined>(
    undefined
);

function useTabsContext() {
    const context = React.useContext(TabsContext);

    if (!context) {
        throw new Error("useTabsContext must be used within a TabsProvider");
    }

    return context;
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
