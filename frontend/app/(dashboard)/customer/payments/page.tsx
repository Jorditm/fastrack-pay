import { DataTable } from '@/components/pages/company/data-table'
import { ColumnDef } from '@tanstack/react-table'

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
    accessorKey: 'amount',
    header: 'Amount',
  },
  {
    accessorKey: 'type',
    header: 'Type',
  },
]

// async function getData(): Promise<Payment[]> {
//     // Fetch data from your API here.
//     return [
//         {
//             id: "728ed52f",
//             name: "test",
//             amount: 100,
//             product: "test",
//             type: "oneTime",
//             status:"pending"
//         },
//         // ...
//     ]
// }

export default async function Page() {
  // const data = await getData()

  return (
    <>
      <h1 className='text-2xl font-bold'>My payments</h1>
      <div className='mt-2 w-full'>
        <DataTable columns={columns} data={[]} />
      </div>
    </>
  )
}
