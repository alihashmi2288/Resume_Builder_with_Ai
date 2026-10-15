import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap text-[14px] font-medium leading-[1.30] transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4262ff] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
  {
    variants: {
      variant: {
        /* Miro Primary: Black Pill */
        default:
          'bg-[#1c1c1e] text-white rounded-full hover:bg-[#2c2c34] active:bg-[#2c2c34] active:scale-[0.98] border border-transparent shadow-none',
        /* Miro Secondary: Outlined Pill */
        secondary:
          'bg-transparent text-[#1c1c1e] dark:text-white border border-[#c7cad5] dark:border-[#3b3b45] rounded-full hover:bg-[#f7f8fa] dark:hover:bg-[#242428] active:scale-[0.98]',
        /* Miro Yellow Pill */
        yellow:
          'bg-[#ffd02f] text-[#1c1c1e] rounded-full hover:bg-[#fcb900] active:scale-[0.98] border border-transparent font-medium',
        /* Miro Blue Pill */
        blue:
          'bg-[#4262ff] text-white rounded-full hover:bg-[#5b76fe] active:bg-[#2a41b6] active:scale-[0.98] border border-transparent',
        /* Miro White Pill on dark backgrounds */
        onDark:
          'bg-white text-[#1c1c1e] rounded-full hover:bg-[#f0f0f3] active:scale-[0.98] border border-transparent font-medium',
        /* Miro Ghost */
        ghost:
          'bg-transparent text-[#1c1c1e] dark:text-white rounded-md hover:bg-[#f7f8fa] dark:hover:bg-[#242428]',
        /* Miro Outline */
        outline:
          'bg-transparent text-[#1c1c1e] dark:text-white border border-[#e0e2e8] dark:border-[#2c2c34] rounded-full hover:bg-[#f7f8fa] dark:hover:bg-[#242428]',
        /* Destructive */
        destructive:
          'bg-[#ff9999] text-[#600000] rounded-full hover:bg-[#ffc6c6]',
        /* Miro Link */
        link:
          'bg-transparent text-[#4262ff] hover:underline p-0 rounded-none h-auto font-medium',
      },
      size: {
        default: 'h-[42px] px-6 py-2.5',
        sm:      'h-[34px] px-4 py-1.5 text-xs',
        lg:      'h-[48px] px-8 py-3 text-[15px]',
        icon:    'size-9 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };