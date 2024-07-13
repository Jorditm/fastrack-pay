'use client'

import { AnimatedCheck } from '@/components/animatedCheck'
import { Button } from '@/components/ui/button'
import { abi } from '@/lib/wagmi/companyAbi'
import { cn } from '@/lib/utils'
// import { vaultiumContract } from '@/lib/wagmi/vaultiumContract'
import { motion } from 'framer-motion'
import { FileBoxIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import lighthouse from '@lighthouse-web3/sdk'

export default function Uploader({ onChange }: { onChange: (e: any) => void }) {
    const [file, setFile] = useState<any | null>(null)
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    const { data: hash, isPending, writeContract } = useWriteContract()

    // TODO: IMPROVE THE WORKFLOW AFTER THE TRANSACTION IS CONFIRMED AFTER INSERT THE IPFSCID
    // const {
    //     data,
    //     isLoading: isUpdatingChallenge,
    //     isSuccess: isConfirmed,
    // } = useWaitForTransactionReceipt({
    //     hash,
    //     confirmations: 2,
    //     pollingInterval: 100,
    // })

    // const uploadToLighhouse = async (fileName: string, file: any) => {
    //     setIsSubmitting(true)
    //     setSigningContract(true)
    //     const formData = new FormData()
    //     // Extract the file extension
    //     const fileExtension = fileName.slice(
    //         ((fileName.lastIndexOf('.') - 1) >>> 0) + 2
    //     )

    //     // Append the file extension to the game hash
    //     const newFileName = `${game.gameHash}.${fileExtension}`
    //     const newGame = new File([file], newFileName)

    //     formData.append('file', newGame)

    // fetch('https://node.lighthouse.storage/api/v0/add', {
    //     method: 'POST',
    //     headers: {
    //         Authorization: `Bearer ${process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY}`,
    //     },
    //     body: formData,
    // })
    //     .then((response) => response.json())
    //     .then((data) => {
    //         if (data.Hash) {
    //             console.log("entra")

    //             // setUploadedSuccessfully(true)
    //             // setIsSubmitting(false)
    //             // setUploadGame(false)
    //             const ipfsCid = data.Hash
    //             writeContract({
    //                 abi: companyAbi,
    //                 address: localStorage.getItem('companyAccount'),
    //                 functionName: 'challengeAbandonwareVersion',
    //                 args: [game.gameHash, ipfsCid, 'image not uploaded'],
    //                 chainId: sepolia.id,
    //             })
    //         }
    //     })
    //     .catch((error) => console.error('Error:', error))

    // }


    // useEffect(() => {

    //     setUploadingGame(isUpdatingChallenge)
    //     setUploadedSuccessfully(isConfirmed)
    //     if (isUpdatingChallenge) {
    //         console.log("SUBIENDO")
    //         setSigningContract(false)
    //     }
    //     if (isConfirmed) {
    //         console.log("confirmado")
    //         setIsSubmitting(false)

    //     }
    // }, [isConfirmed, isUpdatingChallenge])


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
