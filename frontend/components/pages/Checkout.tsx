'use client'
import {
  redirect,
  useParams,
  useRouter,
  useSearchParams,
} from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '../ui/label'
import { ethers, Eip1193Provider } from 'ethers'
import web3auth from '@/lib/web3auth/provider'
import { CONTRACT_ADDRESS } from '@/lib/constants'
import { abi } from '@/lib/wagmi/abi'
import { abiCustomer } from '@/lib/wagmi/abiCustomer'
import {
  CallWithERC2771Request,
  GelatoRelay,
  SignerOrProvider,
} from '@gelatonetwork/relay-sdk'
import { useEffect, useState } from 'react'
import { toast } from '../ui/use-toast'
import { useTransactionReceipt } from 'wagmi'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import ProductImage from '@/public/product.jpg'

const formSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: 'Title must be at least 2 characters.',
    })
    .nullable()
    .optional(),
  price: z
    .number()
    .min(1, {
      message: 'Price must be at least 1.',
    })
    .nullable()
    .optional(),
  description: z
    .string()
    .min(2, {
      message: 'Description must be at least 2 characters.',
    })
    .nullable()
    .optional(),
  recurring: z
    .string()
    .min(2, {
      message: 'Recurring must be at least 2 characters.',
    })
    .nullable()
    .optional(),
  available: z
    .string()
    .min(2, {
      message: 'Available must be at least 2 characters.',
    })
    .nullable()
    .optional(),
  interval: z
    .number()
    .min(0, {
      message: 'Interval must be at least 0.',
    })
    .nullable()
    .optional(),
  imageUrl: z
    .instanceof(File, {
      message: "Image can't be empty.",
    })
    .nullable()
    .optional(),
})

export default function Checkout() {
  const [loading, setLoading] = useState(false)
  const [transactionHash, setTransactionHash] = useState<`0x${string}` | null>(
    null
  )

  const router = useRouter()
  const searchParams = useSearchParams()
  const price = searchParams.get('price')
  const company = searchParams.get('companyName')
  const title = searchParams.get('title')
  const description = searchParams.get('description')
  const recurring = searchParams.get('recurring')
  const interval = secondsToDays(Number(searchParams?.get('interval')))

  const { data, refetch } = useTransactionReceipt({
    hash: transactionHash as `0x${string}`,
  })
  useEffect(() => {
    if (!data) {
      refetch()
    }
    if (data) {
      router.push('/payment-success')
    }
  }, [data])

  function secondsToDays(seconds: number) {
    const secondsInADay = 86400
    const days = seconds / secondsInADay
    return Math.round(days)
  }

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

  const onSubmit = async () => {
    setLoading(true)
    //MOCKED RESPONSE
    setTimeout(() => {
      setLoading(false)
      router.push("/payment-success")
    }, 1500)
    const relay = new GelatoRelay()
    const ethersProvider = new ethers.BrowserProvider(
      web3auth.provider as Eip1193Provider
    )
    const signer = await ethersProvider.getSigner()
    const user = await signer.getAddress()
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abiCustomer, signer)

    const { data: txData } = await contract.addSubscription.populateTransaction(
      {
        companyContract: '0xdd393daa360299023a754f1fe112a3f8a1edbd55',
        productId:
          '0x0000000000000000000000009f351ac673dee941a36e7d15899e311f2b4583a8',
      }
    )
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
          description: 'Payment cancelled',
          variant: 'destructive',
        })
      }
    }

    const statusInterval = setInterval(checkStatus, 5000) // Poll
  }

  return (
    <div className='flex h-screen w-full items-center justify-center bg-primary p-4 lg:bg-gray-100'>
      <Card className='flex flex-col items-center justify-center overflow-hidden rounded-lg p-12 lg:h-full lg:w-full lg:p-4'>
        <div className='flex items-start justify-start gap-4'>
          <Image
            src='/fastrackpay-icon.png'
            alt='Login Image'
            className='object-cover object-center'
            width={50}
            height={50}
          />
          <p className='pt-1.5 text-3xl font-bold text-primary'>Fastrack Pay</p>
        </div>
        <div className='flex w-full max-w-[1200px] content-center items-center justify-between pb-10'>
          <div className='flex w-1/2 flex-col items-center justify-center gap-6'>
            <div className='flex w-72 flex-col items-start justify-start'>
              <div className='flex flex-col items-start justify-start'>
                <p className=''>Price</p>
                <p className='text-2xl'>{price} ETH</p>
              </div>
            </div>
            <div className='flex h-80 w-72 items-center justify-center overflow-hidden rounded-lg border border-primary'>
              <Image
                src={ProductImage}
                alt='Login Image'
                className='object-cover object-center'
                width={400}
                height={400}
                priority={true}
              />
            </div>
          </div>
          <div className='flex w-2/3 items-center justify-center'>
            <div className='flex w-3/4 flex-col items-center justify-center gap-4'>
              <div className='grid gap-2 text-center'>
                <h1 className='text-3xl font-bold'>Checkout</h1>
              </div>
              <div className='flex w-full flex-col gap-6'>
                <div className='flex w-full flex-col gap-4'>
                  <div className='space-y-1'>
                    <Label className='text-primary' htmlFor='name'>
                      Company name
                    </Label>
                    <p className='ml-4'>{company}</p>
                  </div>
                  <div className='space-y-1'>
                    <Label className='text-primary' htmlFor='name'>
                      Product name
                    </Label>
                    <p className='ml-4'>{title}</p>
                  </div>
                  <div className='space-y-1'>
                    <Label className='text-primary' htmlFor='name'>
                      Product description
                    </Label>
                    <p className='ml-4'>{description}</p>
                  </div>
                  <div className='space-y-1'>
                    <Label className='text-primary' htmlFor='name'>
                      Product price
                    </Label>
                    <p className='ml-4'>{price}</p>
                  </div>

                  <div className='space-y-1'>
                    <Label className='text-primary' htmlFor='name'>
                      Product type
                    </Label>
                    <p className='ml-4'>
                      {recurring === 'false'
                        ? 'One time payment'
                        : 'Subscription'}
                    </p>
                  </div>
                  {recurring === 'true' && (
                    <div className='space-y-1'>
                      <Label className='text-primary' htmlFor='name'>
                        Product interval
                      </Label>
                      <p className='ml-4'>{interval} days</p>
                    </div>
                  )}
                </div>
                <div className='w-full'>
                  <Button
                    disabled={loading}
                    className='w-full'
                    onClick={onSubmit}
                  >
                    {loading ? 'Confirming payment...' : 'Pay'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
