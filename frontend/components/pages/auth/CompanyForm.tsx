import { Input } from '@/components/ui/CustomInput'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import useSession from '@/hooks/useSession'
import { useConfig, useWriteContract } from 'wagmi'
import { abi } from '@/lib/wagmi/abi'
import { CONTRACT_ADDRESS } from '@/lib/constants'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { waitForTransactionReceipt } from '@wagmi/core'
import useWeb3AuthCustomProvider from '@/hooks/useWeb3Auth'
import web3auth from '@/lib/web3auth/provider'
import { Web3 } from 'web3'
import { Result } from 'postcss'
import { redirect } from 'next/navigation'

const FormSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
})

export default function CompanyForm() {
  const { user, wallet } = useSession()
  const { setProvider, setLoggedIn } = useWeb3AuthCustomProvider()
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      companyName: '',
      email: '',
      password: '',
    },
  })

  useEffect(() => {
    if (user) {
      form.setValue('email', user.email)
      form.setValue('companyName', user.name)
    }
  }, [user])

  const config = useConfig()

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const { companyName, email, password } = data
    //TODO: ADD THE DATA TO THE NEW CONTRACT
    const web3 = new Web3(web3auth.provider as any)
    const contract = new web3.eth.Contract(
      JSON.parse(JSON.stringify(abi)),
      CONTRACT_ADDRESS
    )
    const result = await contract.methods
      .deployCompanyAccount(['patata', 'banana'])
      .send({ from: wallet as string })
      if(result){
        const companyAccountContract =  "0x" + result?.events?.CompanyAccountCreated.data.slice(-40)
        localStorage.setItem('companyAccount', companyAccountContract.toString())
        redirect('/company/products')
      }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='mx-auto w-[350px] space-y-4'
        noValidate
      >
        <FormField
          control={form.control}
          name='companyName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder='Company Name' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='email@email.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <div className='flex items-center justify-between'>
                <FormLabel>Password</FormLabel>
                <button
                  onClick={(e) => {
                    e.preventDefault() // Prevent form submission
                    setShowPassword(!showPassword)
                  }}
                  className='outline-none focus:outline-none'
                >
                  {showPassword ? (
                    <EyeOffIcon className='h-5 w-5 text-gray-500' />
                  ) : (
                    <EyeIcon className='h-5 w-5 text-gray-500' />
                  )}
                </button>
              </div>
              <FormControl>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='password'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type='submit'
          className='w-full'
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? 'Loading...' : 'Submit'}
        </Button>
      </form>
    </Form>
  )
}
