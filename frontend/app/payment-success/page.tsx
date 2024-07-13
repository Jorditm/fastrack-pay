'use client'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'

export default function Page() {
  const router = useRouter()

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
        <div className='flex mx-auto text-center content-center items-center justify-between mt-4'>
          <p>Payment successfully! You are been redirected...</p>
        </div>
      </Card>
    </div>
  )
}
