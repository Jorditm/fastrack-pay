'use client'
import { Label } from '@/components/ui/label'
import { useEffect, useState } from 'react'
import { redirect, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import CompanyForm from '@/components/pages/auth/CompanyForm'
import PersonForm from '@/components/pages/auth/PersonForm'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { abi } from '@/lib/web3auth/abi'
import useSession from '@/hooks/useSession'
import { CONTRACT_ADDRESS } from '@/lib/constants'
import { Checkbox } from '@/components/ui/checkbox'
import {ethers, Eip1193Provider} from "ethers"
import web3auth from '@/lib/web3auth/provider'

export default function Setup() {
  const [type, setType] = useState<'company' | 'person'>('company')
  const [confirmAddress, setConfirmAddress] = useState(false)
  const { wallet } = useSession()

  const getSigner = async () => {
    const ethersProvider = new ethers.BrowserProvider(web3auth.provider as Eip1193Provider)
    const signer = await ethersProvider.getSigner()
    return signer
  }
  const signer = await getSigner()

  // useEffect(() => {
  //   if (data !== 0) {
  //     if (data === 1) {
  //       redirect('/personal')
  //     }
  //     if (data === 2) {
  //       redirect('/company')
  //     }
  //   }
  // }, [data])

  return (
    <>
      {/* {isFetching ? (
        <div className='my-12 min-h-80 min-w-96 animate-pulse rounded-md bg-zinc-800 shadow-sm'></div>
      ) : ( */}
      <div className='flex flex-col items-center justify-center gap-4'>
        <div className='grid gap-2 text-center'>
          <h1 className='text-3xl font-bold'>Setup</h1>
          <p className='text-balance text-muted-foreground'>Set up your info</p>
        </div>
        <div className='flex w-full flex-col gap-6'>
          <RadioGroup
            className='flex w-full justify-between gap-3'
            onValueChange={(value: string) => {
              setType(value as 'company' | 'person')
            }}
            defaultValue='company'
          >
            <div
              className={cn(
                'flex w-1/2 items-center space-x-2 rounded-md border px-2 py-5',
                type === 'company'
                  ? 'border-primary text-primary'
                  : 'border-white'
              )}
            >
              <RadioGroupItem value={'company'} />
              <Label htmlFor='option-one'>I&apos;m company</Label>
            </div>
            <div
              className={cn(
                'flex w-1/2 items-center space-x-2 rounded-md border px-2 py-5',
                type === 'person'
                  ? 'border-primary text-primary'
                  : 'border-white'
              )}
            >
              <RadioGroupItem value={'person'} />
              <Label htmlFor='option-two'>I&apos;m a person</Label>
            </div>
          </RadioGroup>
          <div className='w-full rounded-md border border-primary bg-muted px-6 py-3'>
            <div>
              <Label>This is wallet is assigned to you:</Label>
              <p className='text-sm text-primary'>{wallet}</p>
            </div>
            <div className='mt-4 flex w-full items-start justify-start gap-2'>
              <Checkbox
                id='terms'
                checked={confirmAddress}
                onCheckedChange={(checked) =>
                  setConfirmAddress(checked === true)
                }
              />
              <label
                htmlFor='terms'
                className='text-sm font-medium leading-4 peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
              >
                Check this box to confirm that you sent tokens to this wallet
                before continue
              </label>
            </div>
          </div>
          {type === 'company' ? (
            <CompanyForm confirmTokens={confirmAddress} />
          ) : (
            <PersonForm confirmTokens={confirmAddress}/>
          )}
        </div>
      </div>
      {/* )} */}
    </>
  )
}
