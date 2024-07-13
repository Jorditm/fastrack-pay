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
import { abi } from '@/lib/wagmi/abi'
import { CONTRACT_ADDRESS } from '@/lib/constants'

const FormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
})

export default function PersonForm() {
  const { user, wallet } = useSession()
  const [showPassword, setShowPassword] = useState(false)
  const { status, data: hash, writeContract } = useWriteContract()


  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
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
    console.log('data', data)
    //TODO: ADD THE DATA TO THE NEW CONTRACT
    writeContract({
      abi,
      address: CONTRACT_ADDRESS,
      functionName: 'deployCustomerAccount',
      args: [wallet],
    })
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
      <Button type='submit' className='w-full' disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? 'Loading...' : 'Submit'}
      </Button>
      </form>
    </Form>
  )
}
