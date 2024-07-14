'use client'
import { DataTable } from '@/components/pages/company/data-table'
import { Input } from '@/components/ui/CustomInput'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/form'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

import { ColumnDef } from '@tanstack/react-table'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Textarea } from '@/components/ui/textarea'
import { useEffect, useState } from 'react'
import Web3 from 'web3'
import web3auth from '@/lib/web3auth/provider'
import { CONTRACT_ADDRESS } from '@/lib/constants'
import { abiCompany } from '@/lib/wagmi/companyAbi'
import useSession from '@/hooks/useSession'
import useWeb3AuthCustomProvider from '@/hooks/useWeb3Auth'
import Uploader from '@/components/upload/uploader'
import { ethers, Eip1193Provider } from 'ethers'
import { redirect } from 'next/navigation'
import {
    CallWithERC2771Request,
    GelatoRelay,
    SignerOrProvider,
} from '@gelatonetwork/relay-sdk'
import { toast } from '@/components/ui/use-toast'
import { useTransactionReceipt } from 'wagmi'
import { productsData } from '@/lib/data/mochup'
import { CheckIcon, XIcon } from 'lucide-react'

const formSchema = z.object({
    title: z.string().min(2, {
        message: 'Title must be at least 2 characters.',
    }),
    price: z.number().min(1, {
        message: 'Price must be at least 1.',
    }),
    description: z.string().min(2, {
        message: 'Description must be at least 2 characters.',
    }),
    recurring: z.string().min(2, {
        message: 'Recurring must be at least 2 characters.',
    }),
    available: z.string().min(2, {
        message: 'Available must be at least 2 characters.',
    }),
    interval: z
        .number()
        .min(0, {
            message: 'Interval must be at least 0.',
        })
        .nullable()
        .optional(),
    imageUrl: z.instanceof(File, {
        message: "Image can't be empty.",
    }),
})

export type Product = {
    id: string
    title: string
    price: number
    description: string
    recurring: boolean
    available: boolean
    interval: number
}

const columns: ColumnDef<Product>[] = [
    {
        accessorKey: 'title',
        header: 'Title',
    },
    {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ row }) => {
            return <div>{row.original.price} USDC</div>
        }
    },
    {
        accessorKey: "recurring",
        header: "Recurring",
        cell: ({ row }) => {
            if (row.original.recurring) {
                return <CheckIcon className="w-4 h-4 stroke-green-500" />
            }
            return <XIcon className="w-4 h-4 stroke-red-500" />
        }
    },
    {
        accessorKey: 'description',
        header: 'Description',
    },
    {
        accessorKey: 'available',
        header: 'Available',
        cell: ({ row }) => {
            if (row.original.recurring) {
                return <CheckIcon className="w-4 h-4 stroke-green-500" />
            }
            return <XIcon className="w-4 h-4 stroke-red-500" />
        }
    },
    {
        accessorKey: 'interval',
        header: 'Interval',
        cell: ({ row }) => {
            return <div>{row.original.interval} days</div>
        }
    },
]




export default function Page() {
    const [products, setProducts] = useState<Product[]>(productsData)
    const { user, wallet } = useSession()
    const { setProvider, setLoggedIn } = useWeb3AuthCustomProvider()
    const [loading, setLoading] = useState(false)
    const [transactionHash, setTransactionHash] = useState<`0x${string}` | null>(
        null
    )
    const { data, refetch } = useTransactionReceipt({
        hash: transactionHash as `0x${string}`
    })

    useEffect(() => {
        if (!data) {
            refetch()
        }
        if (data) {
            setIsOpen(false)
        }
    }, [data])

    const [isOpen, setIsOpen] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            price: 0,
            description: '',
            recurring: 'false',
            available: 'false',
            interval: 0,
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true)
        const relay = new GelatoRelay()
        const ipfsCid = await uploadToLighhouse(
            values.imageUrl.name,
            values.imageUrl
        )
        if (ipfsCid) {
            const ethersProvider = new ethers.BrowserProvider(
                web3auth.provider as Eip1193Provider
            )
            const signer = await ethersProvider.getSigner()
            const user = await signer.getAddress()
            const contract = new ethers.Contract(CONTRACT_ADDRESS, abiCompany, signer)

            const parsedValues = {
                title: values.title,
                price: Number(values.price),
                description: values.description,
                recurring: values.recurring === 'true' ? true : false,
                available: values.available === 'true' ? true : false,
                interval: Number(values.interval) * 86400,
                imageUrl: ipfsCid,
            }
            const { data: txData } =
                await contract.createProduct.populateTransaction(parsedValues)

            const request: CallWithERC2771Request = {
                chainId: (await ethersProvider.getNetwork()).chainId,
                target: CONTRACT_ADDRESS,
                data: txData,
                user: user,
            }
            const GELATO_API_KEY = 'c3KruXJBGkyYZwXLVNbHKVjVrTxbAq1BB0WDxlSw_Sc_'

            const relayResponse = await relay.sponsoredCallERC2771(
                request,
                ethersProvider as unknown as SignerOrProvider,
                GELATO_API_KEY
            )

            const checkStatus = async () => {
                const status = await relay.getTaskStatus(relayResponse.taskId)

                if (status?.taskState === 'ExecSuccess') {
                    clearInterval(statusInterval)
                    if (status.transactionHash) {
                        setTransactionHash(status?.transactionHash as `0x${string}`)
                    }
                }
                if (status?.taskState === 'Cancelled') {
                    clearInterval(statusInterval)
                    setLoading(false)
                    toast({
                        title: 'Error',
                        description: 'Transaction cancelled',
                        variant: 'destructive',
                    })
                }
            }
            const statusInterval = setInterval(checkStatus, 5000) // Poll every 5 seconds
        }
    }
    const uploadToLighhouse = async (
        fileName: string,
        file: any
    ): Promise<string | null> => {
        const formData = new FormData()
        // Extract the file extension
        const fileExtension = fileName.slice(
            ((fileName.lastIndexOf('.') - 1) >>> 0) + 2
        )

        // Append the file extension to the game hash
        const random = Math.round(Math.random() * 1000000)
        const newFileName = `${fileName}-${random}.${fileExtension}`
        const newGame = new File([file], newFileName)

        formData.append('file', newGame)

        try {
            const response = await fetch(
                'https://node.lighthouse.storage/api/v0/add',
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY}`,
                    },
                    body: formData,
                }
            )

            const data = await response.json()
            if (data.Hash) {
                return data.Hash
            } else {
                return null
            }
        } catch (error) {
            console.error('Error:', error)
            return null
        }
    }

    useEffect(() => {
        form.setValue('interval', 0)
    }, [form.watch('recurring')])

    return (
        <>
            <div className='flex items-center justify-between'>
                <h1 className='text-2xl font-bold'>Products</h1>
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button variant='default'>Add Product</Button>
                    </SheetTrigger>
                    <SheetContent className='w-[400px] overflow-y-auto sm:w-[540px]'>
                        <SheetHeader>
                            <SheetTitle>New product</SheetTitle>
                            <SheetDescription>Add a new product .</SheetDescription>
                        </SheetHeader>
                        <Form {...form}>
                            <form
                                className='flex flex-col gap-6'
                                onSubmit={form.handleSubmit(onSubmit)}
                            >
                                <div className='flex flex-col gap-2'>
                                    <FormField
                                        control={form.control}
                                        name='title'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel htmlFor='title'>Product title</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        id='title'
                                                        value={field.value}
                                                        onChange={(e) => field.onChange(e.target.value)}
                                                        className='col-span-2 h-10'
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='description'
                                        render={({ field }) => (
                                            <FormItem className=''>
                                                <FormLabel htmlFor='description'>Description</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        id='description'
                                                        value={field.value}
                                                        onChange={(e) => field.onChange(e.target.value)}
                                                        className='col-span-2 h-10'
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='price'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel htmlFor='price'>Price</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        id='price'
                                                        type='number'
                                                        value={field.value}
                                                        onChange={(e) =>
                                                            field.onChange(e.target.valueAsNumber)
                                                        }
                                                        className='col-span-2 h-10'
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='recurring'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel htmlFor='recurring'>
                                                    Recurring payment
                                                </FormLabel>
                                                <FormControl>
                                                    <Select
                                                        value={field.value}
                                                        onValueChange={(value) => field.onChange(value)}
                                                    >
                                                        <SelectTrigger className='w-full'>
                                                            <SelectValue placeholder='' />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value={'true'}>Yes</SelectItem>
                                                            <SelectItem value={'false'}>No</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    {form.watch('recurring') === 'true' && (
                                        <FormField
                                            control={form.control}
                                            name='interval'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel htmlFor='interval'>
                                                        Interval (in days)
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            id='interval'
                                                            type='number'
                                                            value={field.value as number}
                                                            onChange={(e) =>
                                                                field.onChange(e.target.valueAsNumber)
                                                            }
                                                            className='col-span-2 h-10'
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    )}
                                    <FormField
                                        control={form.control}
                                        name='available'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel htmlFor='available'>Available</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        value={field.value}
                                                        onValueChange={(value) => field.onChange(value)}
                                                    >
                                                        <SelectTrigger className='w-full'>
                                                            <SelectValue placeholder='status' />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value={'true'}>Yes</SelectItem>
                                                            <SelectItem value={'false'}>No</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='imageUrl'
                                        render={({ field }) => {
                                            return (
                                                <FormItem>
                                                    <FormLabel htmlFor='imageUrl'>Image</FormLabel>
                                                    <FormControl>
                                                        <div className='mt-12 w-full max-w-lg'>
                                                            <Uploader
                                                                file={field.value}
                                                                onChange={field.onChange}
                                                            />
                                                        </div>
                                                    </FormControl>
                                                </FormItem>
                                            )
                                        }}
                                    />
                                </div>
                                <div className='w-full'>
                                    <Button disabled={loading} className='w-full' type='submit'>
                                        {loading ? "Uploading product.." : "Add Product"}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </SheetContent>
                </Sheet>
            </div>
            <div className='mx-auto py-10'>
                <DataTable columns={columns} data={products} />
            </div>
        </>
    )
}
