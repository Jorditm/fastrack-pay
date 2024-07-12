'use client'
import { Label } from '@/components/ui/label'
import { useEffect, useState } from 'react'
import { redirect, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import CompanyForm from '@/components/pages/auth/CompanyForm'
import PersonForm from '@/components/pages/auth/PersonForm'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useReadContract } from 'wagmi'
import { abi } from '@/lib/wagmi/abi'
import useSession from '@/hooks/useSession'

export default function Setup() {
  const [type, setType] = useState<'company' | 'person'>('company')
  const { wallet } = useSession()

  const { data, isFetching } = useReadContract({
    abi,
    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    functionName: 'accounts',
    args: [wallet],
  })

  useEffect(() => {
    if (data !== 0) {
      if (data === 1) {
        redirect('/personal')
      }
      if (data === 2) {
        redirect('/company')
      }
    }
  }, [data])

  return (
    <>
      {isFetching ? (
        <div className='my-12 min-h-80 min-w-96 animate-pulse rounded-md bg-zinc-800 shadow-sm'></div>
      ) : (
        <div className='flex flex-col items-center justify-center gap-4'>
          <div className='grid gap-2 text-center'>
            <h1 className='text-3xl font-bold'>Setup</h1>
            <p className='text-balance text-muted-foreground'>
              Set up your info
            </p>
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
            {type === 'company' ? <CompanyForm /> : <PersonForm />}
          </div>
        </div>
      )}
    </>
  )
}
