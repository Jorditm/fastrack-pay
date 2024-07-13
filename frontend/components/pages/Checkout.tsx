'use client'
import { redirect, useParams, useRouter, useSearchParams } from 'next/navigation'
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

export default function Checkout() {
  const [loading, setLoading] = useState(false)
  const [transactionHash, setTransactionHash] = useState<string | null>(null)

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
      const companyAddress = '0x' + data.logs[1].data.slice(-40)
      localStorage.setItem('companyAddress', companyAddress)
      redirect('/payment-success')
    }
  }, [data])

  function secondsToDays(seconds: number) {
    const secondsInADay = 86400
    const days = seconds / secondsInADay
    return Math.round(days)
  }

  const onSubmit = async () => {
    //TODO: ADD FAKE DATA TO DIRECTLY ADD SUBSCRIPTION METHOD TO CUSTOMER CONTRACT
    const relay = new GelatoRelay()
    const ethersProvider = new ethers.BrowserProvider(
      web3auth.provider as Eip1193Provider
    )
    const signer = await ethersProvider.getSigner()
    const user = await signer.getAddress()
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abiCustomer, signer)

    const { data: txData } = await contract.addSubscription.populateTransaction(
      {
        name: 'banana',
        logoUrl: 'https://www.google.com',
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
        <div className='flex w-full max-w-[1200px] content-center items-center justify-between'>
          <div className='flex w-1/2 flex-col items-center justify-center gap-6'>
            <div className='flex w-72 flex-col items-start justify-start'>
              <div className='flex flex-col items-start justify-start'>
                <p className=''>Price</p>
                <p className='text-2xl'>{price} ETH</p>
              </div>
            </div>
            <div className='flex h-72 w-72 items-center justify-center rounded-lg border border-primary'>
              Image product
            </div>
          </div>
          <div className='flex w-1/2 items-center justify-center'>
            <div className='flex w-2/3 flex-col items-center justify-center gap-4'>
              <div className='grid gap-2 text-center'>
                <h1 className='text-3xl font-bold'>Checkout</h1>
              </div>
              <div className='flex w-full flex-col gap-6'>
                <div className='flex w-full flex-col gap-6'>
                  <div className='flex w-full flex-col gap-4'>
                    <div className='space-y-2'>
                      <Label className='text-primary' htmlFor='name'>
                        Company name
                      </Label>
                      <p className='ml-4'>{company}</p>
                    </div>
                    <div className='space-y-2'>
                      <Label className='text-primary' htmlFor='name'>
                        Product name
                      </Label>
                      <p className='ml-4'>{title}</p>
                    </div>
                    <div className='space-y-2'>
                      <Label className='text-primary' htmlFor='name'>
                        Product description
                      </Label>
                      <p className='ml-4'>{description}</p>
                    </div>
                    <div className='space-y-2'>
                      <Label className='text-primary' htmlFor='name'>
                        Product price
                      </Label>
                      <p className='ml-4'>{price}</p>
                    </div>

                    <div className='space-y-2'>
                      <Label className='text-primary' htmlFor='name'>
                        Product recurring
                      </Label>
                      <p className='ml-4'>{recurring}</p>
                    </div>
                    <div className='space-y-2'>
                      <Label className='text-primary' htmlFor='name'>
                        Product interval
                      </Label>
                      <p className='ml-4'>{interval} days</p>
                    </div>
                  </div>
                  <div className='w-full'>
                    <Button className='w-full' type='button'>
                      Pay
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
