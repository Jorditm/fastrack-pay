import { Input } from '@/components/ui/CustomInput'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import useSession from '@/hooks/useSession'
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
import {
  CallWithERC2771Request,
  GelatoRelay,
  SignerOrProvider,
} from '@gelatonetwork/relay-sdk'
import { Provider } from '@radix-ui/react-toast'
import { toast } from '@/components/ui/use-toast'
import { useWaitForTransactionReceipt } from 'wagmi'



const FormSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  email: z.string().email('Invalid email address'),
})

export default function CompanyForm() {
  const { user, wallet } = useSession()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      companyName: '',
      email: '',
    },
  })
  const [loading, setLoading] = useState(false)
  const responseHash = '0xa8ca957df5097b27a0508b8c86951175f47a8e08e75dc2bdfb6909271ff97570'
  const [transactionHash, setTransactionHash] = useState<`0x${string}` | null>(responseHash)

  const {data, isFetching} = useWaitForTransactionReceipt({
    hash: transactionHash as `0x${string}`,
  })
  console.log("result", data)
  console.log("is fetching", isFetching)

  useEffect(() => {
    if (user) {
      form.setValue('email', user.email)
      form.setValue('companyName', user.name)
    }
  }, [user])



  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true)
    const relay = new GelatoRelay()
    const { companyName, email } = data

    const ethersProvider = new ethers.BrowserProvider(
      web3auth.provider as Eip1193Provider
    )
    const signer = await ethersProvider.getSigner()
    const user = await signer.getAddress()
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer)

    const { data: txData } =
      await contract.deployCompanyAccount.populateTransaction({
        name: 'banana',
        logoUrl: 'https://www.google.com',
      })

    const request: CallWithERC2771Request = {
      chainId: (await ethersProvider.getNetwork()).chainId,
      target: CONTRACT_ADDRESS,
      data: txData,
      user: user,
    }
    const GELATO_API_KEY = 'c3KruXJBGkyYZwXLVNbHKVjVrTxbAq1BB0WDxlSw_Sc_'

    const relayResponse = await relay.sponsoredCallERC2771(
      request,
      ethersProvider as unknown as SignerOrProvider,
      GELATO_API_KEY
    )

    const checkStatus = async () => {
      const status = await relay.getTaskStatus(relayResponse.taskId)
      console.log('currentStatus', status)

      if (status?.taskState === 'ExecSuccess') {
        clearInterval(statusInterval)
        if (status.transactionHash) {
          console.log('transactionHash', status?.transactionHash)
          setTransactionHash(status?.transactionHash)
        }
      }
      if(status?.taskState === "Cancelled"){
        clearInterval(statusInterval)
        setLoading(false)
        toast({
          title: "Error",
          description: "Transaction cancelled",
          variant: "destructive",
        })
      }
    }

    const statusInterval = setInterval(checkStatus, 5000) // Poll every 5 seconds
  }
  console.log('transactionHAsh out', transactionHash)

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

        <Button type='submit' className='w-full' disabled={loading}>
          {loading ? 'Loading...' : 'Submit'}
        </Button>
      </form>
    </Form>
  )
}
