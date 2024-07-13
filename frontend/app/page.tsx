'use client'
import Login from '@/components/pages/auth/Login'
import { Button } from '@/components/ui/button'
import { MenuIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <header className='absolute inset-x-0 top-0 z-50'>
        <nav
          aria-label='Global'
          className='flex items-center justify-between p-6 lg:px-8'
        >
          <div className='flex lg:flex-1'>
            <a href='#' className='-m-1.5 p-1.5'>
              <span className='sr-only'>Your Company</span>
              <Image
                alt=''
                src='/fastrackpay-icon.png'
                width={32}
                height={32}
              />
            </a>
            <p className='pl-2 pt-0.5 text-xl font-bold text-primary'>
              FastrackPay
            </p>
          </div>
          <div className='lg:flex lg:flex-1 lg:justify-end'>
          </div>
        </nav>
      </header>

      <div className='relative isolate px-6 pt-14 lg:px-8'>
        <div
          aria-hidden='true'
          className='absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80'
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className='relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#7aeb34] to-[#09910d] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]'
          />
        </div>
        <div className='mx-auto max-w-2xl py-20'>
          <div className='text-center'>
            <h1 className='text-4xl font-bold tracking-tight text-primary sm:text-6xl'>
              Revolutionize Your Payments with Web3
            </h1>
            <p className='mt-6 text-lg leading-8 text-green-800'>
              Connecting businesses and users directly. Simplify subscriptions
              and one-time payments with the security and efficiency of
              blockchain.
            </p>
            <div className='mt-10 flex items-center justify-center gap-x-6'>
             <Login/>
            </div>
          </div>
        </div>
        <div
          aria-hidden='true'
          className='absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]'
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className='relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#7aeb34] to-[#09910d] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]'
          />
        </div>
      </div>
    </main>
  )
}
