'use client'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  return (
    <div className='flex min-h-screen w-full flex-col items-center gap-4 pt-24'>
      <h1 className='text-2xl font-bold text-primary'>Sample integration</h1>
      <div className='flex w-full flex-col items-center gap-4'>
        <Button
          disabled={true}
          size='lg'
          variant='secondary'
          className='flex min-w-72 items-center justify-center gap-3 py-1.5 text-white'
        >
          Others
        </Button>
        <Button
          onClick={() =>
            router.push(
              '/checkout?price=1&companyName=FastrackPay&title=DemoProduct&description=DemoDescription&recurring=false&interval=1296000'
            )
          }
          size='lg'
          variant='secondary'
          className='flex min-w-72 items-center justify-center gap-3 py-1.5 text-white'
        >
          <Image
            src='/fastrackpay-icon.png'
            alt='Fastrack Pay'
            width={35}
            height={35}
          />
          Pay with FastrackPay
        </Button>
      </div>
    </div>
  )
}
