import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/CustomInput'
import { Label } from '@/components/ui/label'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import useSession from '@/hooks/useSession'
import { useWriteContract } from 'wagmi'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { abi } from '@/lib/web3auth/abi'
import { CONTRACT_ADDRESS } from '@/lib/constants'
import Web3 from 'web3'
import web3auth from '@/lib/web3auth/provider'
import { redirect } from 'next/navigation'

const FormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
})

export default function PersonForm({confirmTokens}: {confirmTokens: boolean}) {
  const { user, wallet } = useSession()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  })

  useEffect(() => {
    if (user) {
      form.setValue('email', user.email)
      form.setValue('name', user.name)
    }
  }, [user])

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const { name, email, password } = data
    //TODO: ADD THE DATA TO THE NEW CONTRACT
    const web3 = new Web3(web3auth.provider as any)
    const contract = new web3.eth.Contract(
      JSON.parse(JSON.stringify(abi)),
      CONTRACT_ADDRESS
    )
    const result = await contract.methods
      .deployCustomerAccount(['patata', 'banana'])
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
        className='w-full space-y-4'
        noValidate
      >
      <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='Name' {...field} />
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
      <Button type='submit' className='w-full' disabled={form.formState.isSubmitting || !confirmTokens}>
        {form.formState.isSubmitting ? 'Loading...' : 'Submit'}
      </Button>
      </form>
    </Form>
  )
}
