import { forwardRef } from 'react'
import { clsx } from 'clsx'
import { Loader2 } from 'lucide-react'

const Button = forwardRef(({
    children,
    variant = 'primary',
    isLoading = false,
    className,
    disabled,
    type = 'button',
    ...props
}, ref) => {

    const baseStyles = 'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
        primary: 'bg-cifp-blue text-white hover:bg-cifp-blue-dark focus:ring-cifp-blue shadow-sm hover:shadow-md',
        secondary: 'border-2 border-cifp-blue text-cifp-blue bg-transparent hover:bg-cifp-blue/10 focus:ring-cifp-blue',
        corporate: 'bg-cifp-red text-white hover:bg-cifp-red-dark focus:ring-cifp-red shadow-sm hover:shadow-md',
    }

    return (
        <button
            ref={ref}
            type={type}
            disabled={disabled || isLoading}
            className={clsx(baseStyles, variants[variant], className)}
            {...props}
        >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {children}
        </button>
    )
})

Button.displayName = 'Button'

export default Button
