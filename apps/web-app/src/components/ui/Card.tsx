import React from 'react';
import { cn } from '@/lib/utils';

// eslint-disable-next-line no-undef
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  children: React.ReactNode;
}

// eslint-disable-next-line no-undef
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(hover ? 'card-hover' : 'card', className)} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// eslint-disable-next-line no-undef
export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 border-b border-neutral-200', className)} {...props} />
  )
);

CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<
  // eslint-disable-next-line no-undef
  HTMLHeadingElement,
  // eslint-disable-next-line no-undef
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn('text-xl font-semibold text-neutral-900', className)} {...props} />
));

CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<
  // eslint-disable-next-line no-undef
  HTMLParagraphElement,
  // eslint-disable-next-line no-undef
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-neutral-500 mt-1', className)} {...props} />
));

CardDescription.displayName = 'CardDescription';

// eslint-disable-next-line no-undef
export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('p-6', className)} {...props} />
);

CardContent.displayName = 'CardContent';

// eslint-disable-next-line no-undef
export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('px-6 py-4 border-t border-neutral-200 bg-neutral-50', className)}
      {...props}
    />
  )
);

CardFooter.displayName = 'CardFooter';
