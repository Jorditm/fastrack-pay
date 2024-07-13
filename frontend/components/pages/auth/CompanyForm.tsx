import { Input } from '@/components/ui/CustomInput'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import useSession from '@/hooks/useSession'
import { useWriteContract } from 'wagmi'


const FormSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
})

export default function CompanyForm() {
  const { user, wallet } = useSession()
  const [showPassword, setShowPassword] = useState(false)
  const { status, data:hash, writeContract } = useWriteContract()



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

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const { companyName, email, password } = data
    console.log('data from signup company', data)
  //   writeContract({ 
  //     abi,
  //     address: '0x6b175474e89094c44da98b954eedeac495271d0f',
  //     functionName: 'transferFrom',
  //     args: [
  //       '0xd2135CfB216b74109775236E36d4b433F1DF507B',
  //       '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
  //       123n,
  //     ],
  //  })
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className='mx-auto grid w-[350px] gap-6'
      noValidate
    >
      <div className='grid gap-2'>
        <Label htmlFor='name'>Company name</Label>
        <Input
          id='name'
          type='text'
          placeholder='company name'
          {...form.register('companyName')}
          required
        />
      </div>
      <div className='grid gap-2'>
        <Label htmlFor='email'>Email</Label>
        <Input
          id='email'
          type='email'
          placeholder='email@email.com'
          {...form.register('email')}
          required
        />
      </div>
      <div className='grid gap-2'>
        <Label htmlFor='password'>Password</Label>
        <Input
          id='password'
          type={showPassword ? 'text' : 'password'}
          placeholder='password'
          {...form.register('password')}
          required
          endAdornment={
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
          }
        />
      </div>
      <Button type='submit' className='w-full' disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? 'Loading...' : 'Submit'}
      </Button>
    </form>
  )
}
