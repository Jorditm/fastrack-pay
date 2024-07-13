import * as React from 'react'

import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  endAdornment?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, endAdornment, ...props }, ref) => {
    return (
      <div className='relative flex items-center'>
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className,
            endAdornment ? 'pr-10' : '' // Adjust padding to make space for the adornment
          )}
          ref={ref}
          {...props}
        />
        {endAdornment && (
          <div className='absolute inset-y-0 right-0 flex items-center pr-3'>
            {endAdornment}
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
