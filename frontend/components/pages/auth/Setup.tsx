'use client'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import CompanyForm from './CompanyForm'

export default function Setup() {
  const [type, setType] = useState<'company' | 'person'>('company')
  const router = useRouter()

  // TODO: Crear un loader para cuando tengamos la wallet
  return (
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
              type === 'person' ? 'border-primary text-primary' : 'border-white'
            )}
          >
            <RadioGroupItem value={'person'} />
            <Label htmlFor='option-two'>I&apos;m a person</Label>
          </div>
        </RadioGroup>
        {type === 'company' ? <CompanyForm/> : <div>Person form</div>}
      </div>
    </div>
  )
}
