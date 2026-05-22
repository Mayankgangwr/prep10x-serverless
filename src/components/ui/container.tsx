import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const containerVariants = cva(
    'w-full transition-all duration-300 ease-in-out',
    {
        variants: {
            fluid: {
                true: 'max-w-full',
                false: 'max-w-7xl',
            },
            padding: {
                none: 'px-0',
                sm: 'px-2',
                md: 'px-2 sm:px-5 lg:px-8',
                lg: 'px-6 sm:px-10 lg:px-16',
            },
            centered: {
                true: 'mx-auto',
                false: 'mx-0',
            },
        },
        defaultVariants: {
            fluid: false,
            padding: 'md',
            centered: true,
        },
    }
);

export interface ContainerProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
    as?: React.ElementType;
}

/**
 * A reusable Container component that standardizes layout spacing across the application.
 * 
 * @param {boolean} fluid - If true, the container will take full width.
 * @param {string} padding - The size of the horizontal padding (none, sm, md, lg).
 * @param {boolean} centered - If true, the container will be centered horizontally.
 * @param {React.ElementType} as - The HTML element to render the container as (default: 'div').
 */
const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
    ({ className, fluid, padding, centered, as: Component = 'div', ...props }, ref) => {
        return (
            <Component
                ref={ref}
                className={cn(containerVariants({ fluid, padding, centered }), className)}
                {...props}
            />
        );
    }
);

Container.displayName = 'Container';

export { Container };
