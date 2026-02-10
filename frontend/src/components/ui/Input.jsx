import { forwardRef } from 'react'
import { clsx } from 'clsx'

const Input = forwardRef(({
    label,
    error,
    className,
    id,
    type = 'text',
    icon: Icon,
    ...props
}, ref) => {

    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`

    const baseStyles = 'block w-full py-2 border rounded-lg shadow-sm transition-all duration-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0'

    const paddingStyles = Icon ? 'pl-10 pr-3' : 'px-3'

    const normalStyles = 'border-gray-300 focus:border-cifp-blue focus:ring-cifp-blue/20'
    const errorStyles = 'border-cifp-red focus:border-cifp-red focus:ring-cifp-red/20'

    return (
        <div className={className}>
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-xs font-bold text-cifp-neutral-900 mb-2 uppercase tracking-wide"
                >
                    {label}
                </label>
            )}

            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className="h-5 w-5 text-cifp-neutral-400" />
                    </div>
                )}

                <input
                    ref={ref}
                    id={inputId}
                    type={type}
                    className={clsx(
                        baseStyles,
                        paddingStyles,
                        error ? errorStyles : normalStyles
                    )}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={error ? `${inputId}-error` : undefined}
                    {...props}
                />
            </div>

            {error && (
                <p
                    id={`${inputId}-error`}
                    className="mt-1 text-sm text-cifp-red"
                >
                    {error}
                </p>
            )}
        </div>
    )
})

Input.displayName = 'Input'

export default Input
