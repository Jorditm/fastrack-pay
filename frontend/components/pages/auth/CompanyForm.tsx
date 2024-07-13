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
import { ethers, Eip1193Provider } from 'ethers'
import { Result } from 'postcss'
import { redirect } from 'next/navigation'
import { CallWithERC2771Request, GelatoRelay, SignerOrProvider } from "@gelatonetwork/relay-sdk"
import { Provider } from '@radix-ui/react-toast'

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

    const relay = new GelatoRelay();

    const { companyName, email, password } = data

    const ethersProvider = new ethers.BrowserProvider(web3auth.provider as Eip1193Provider)
    const signer = await ethersProvider.getSigner()
    console.log(signer)
    const user = await signer.getAddress()
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer)

    console.log("contract", contract)

    const { data: txData} = await contract.deployCompanyAccount.populateTransaction({
      name: "banana",
      logoUrl: 'https://www.google.com'
    })

    console.log("txData", txData)


    const request: CallWithERC2771Request = {
      chainId: (await ethersProvider.getNetwork()).chainId,
      target: CONTRACT_ADDRESS,
      data: txData,
      user: user,
    }    
    const GELATO_API_KEY="c3KruXJBGkyYZwXLVNbHKVjVrTxbAq1BB0WDxlSw_Sc_"

    const relayResponse = await relay.sponsoredCallERC2771(request, ethersProvider as unknown as SignerOrProvider, GELATO_API_KEY)

    console.log(relayResponse)

    const status = await relay.getTaskStatus("0x58987c65ee61decadf4b5ec11ef78ab918b1edb3241c6853db356347b2d463f1")


    console.log(status);

      /*if(result){
        const companyAccountContract =  "0x" + result?.events?.CompanyAccountCreated.data.slice(-40)
        localStorage.setItem('companyAccount', companyAccountContract.toString())
        redirect('/company/products')
      }*/
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