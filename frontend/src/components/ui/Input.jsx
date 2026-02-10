import { forwardRef } from 'react'
import { clsx } from 'clsx'

const Input = forwardRef(({
    label,
    error,
    className,
    id,
    type = 'text',
    ...props
}, ref) => {

    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`

    const baseStyles = 'block w-full px-3 py-2 border rounded-lg shadow-sm transition-all duration-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0'

    const normalStyles = 'border-gray-300 focus:border-cifp-blue focus:ring-cifp-blue/20'
    const errorStyles = 'border-cifp-red focus:border-cifp-red focus:ring-cifp-red/20'

    return (
        <div className={className}>
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-cifp-neutral-700 mb-1"
                >
                    {label}
                </label>
            )}

            <input
                ref={ref}
                id={inputId}
                type={type}
                className={clsx(
                    baseStyles,
                    error ? errorStyles : normalStyles
                )}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? `${inputId}-error` : undefined}
                {...props}
            />

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
