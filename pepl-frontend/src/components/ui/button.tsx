import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 active:scale-[0.96] disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-primary-main text-white shadow-lg shadow-primary-main/20 hover:translate-y-[-2px] hover:shadow-xl hover:shadow-primary-main/30",
                destructive:
                    "bg-accent-error text-white hover:bg-accent-error/90",
                outline:
                    "border-2 border-neutral-300 bg-white text-neutral-700 hover:border-primary-main hover:text-primary-main hover:bg-primary-subtle",
                secondary:
                    "bg-neutral-100 text-neutral-700 hover:bg-neutral-200",
                ghost: "hover:bg-neutral-100 text-neutral-700",
                link: "text-primary-main underline-offset-4 hover:underline",
            },
            size: {
                default: "h-12 px-6",
                sm: "h-10 rounded-xl px-4",
                lg: "h-14 rounded-xl px-8 text-base",
                icon: "h-11 w-11 rounded-full bg-neutral-100 hover:bg-primary-main hover:text-white",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
