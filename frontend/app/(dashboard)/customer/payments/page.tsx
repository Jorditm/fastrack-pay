"use client"
import { DataTable } from '@/components/pages/company/data-table'
import { payamentsData } from '@/lib/data/mochup'
import { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string
  name: string
  amount: number
  status: 'pending' | 'processing' | 'success' | 'failed'
  type: string
  product: string
}

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'product',
    header: 'Product',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'import',
    header: 'Import',
    cell: ({ row }) => {
      return <div>{row.original.amount} USDC</div>
    }
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      if (row.original.type === 'recurring') {
        return <div>Recurring</div>
      }
      return <div>One time</div>
    }
  },
]



export default async function Page() {
  const [payments, setPayments] = useState<Payment[]>(payamentsData)


  return (
    <>
      <h1 className='text-2xl font-bold'>My payments</h1>
      <div className='mt-2 w-full'>
        <DataTable columns={columns} data={payments} />
      </div>
    </>
  )
}
