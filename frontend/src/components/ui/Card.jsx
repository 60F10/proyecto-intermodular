import { clsx } from 'clsx'

function Card({ children, className, ...props }) {
    return (
        <div
            className={clsx(
                'bg-white rounded-xl shadow-md p-6',
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}

export default Card
