import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

export const AnimatedCheck = ({ classname }: { classname: string }) => {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            width={24}
            height={24}
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            className={cn(
                'icon icon-tabler icons-tabler-outline icon-tabler-check fill-none stroke-2',
                classname
            )}
        >
            <path stroke='none' d='M0 0h24v24H0z' fill='none' />
            <motion.path
                d='M5 12l5 5l10 -10'
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.2 }}
            />
        </svg>
    )
}
