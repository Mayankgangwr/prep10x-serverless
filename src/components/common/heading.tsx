import { cn } from "@/lib/utils";
import React from "react";

type HeadingProps = {
    children: React.ReactNode;
    className?: string;
};

const Heading: React.FC<HeadingProps> = ({ children, className }) => {
    return (
        <h2
            className={cn("text-3xl font-semibold tracking-tight", className)}>
            {children}
        </h2>
    )
}

export default Heading;
