'use client'

import { AnimatedCheck } from '@/components/animatedCheck'
import { Button } from '@/components/ui/button'
import { abi } from '@/lib/wagmi/companyAbi'
import { cn } from '@/lib/utils'
// import { vaultiumContract } from '@/lib/wagmi/vaultiumContract'
import { motion } from 'framer-motion'

export default function Uploader({ file, onChange }: { file: File, onChange: (e: any) => void }) {

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className='mb-0.5 flex items-center gap-2'
            >
                <div className={'relative h-12 w-full cursor-pointer'}>
                    <input
                        accept='image/*'
                        type={'file'}
                        className={
                            'absolute left-0 top-0 z-10 h-12 cursor-pointer opacity-0'
                        }
                        name={'file'}
                        onChange={(e) => {
                            onChange(e.target.files?.[0])
                        }}
                    />
                    <div className='absolute left-0 top-0 flex h-12 w-full cursor-pointer items-center justify-start gap-2 rounded-lg border-2 pl-2 pt-2 text-sm font-light text-black'>
                        {file && (
                            <AnimatedCheck classname='h-5 w-5 stroke-primary' />
                        )}
                        <p
                            className={cn(
                                'font-light tracking-wide text-white',
                                file && 'italic text-primary',
                                !file && 'pl-6'
                            )}
                        >
                            {file ? file.name : 'Select a image to upload'}
                        </p>
                    </div>
                </div>

            </motion.div>
            <p className='mb-3 text-xs italic text-primary/50'>
                Please note: Only images are supported.
            </p>
            <div className='flex items-center justify-between gap-2'>
                {/* <Button
                    // onClick={() => uploadToIPFS(file.name, file)}
                    onClick={() => uploadToLighhouse(file.name, file)}
                    disabled={!file || isSubmitting}
                    className='w-full text-base text-foreground transition duration-300 hover:text-white active:scale-90'
                >
                    {isSubmitting ? 'Uploading...' : 'Upload'}
                </Button>
                <Button
                    variant={'secondary'}
                    onClick={() => setUploadGame(false)}
                    className=' w-28 text-base text-foreground transition duration-300 hover:bg-primary/30 hover:text-white active:scale-90'
                >
                    Cancel
                </Button> */}
            </div>

        </>
    )
}
