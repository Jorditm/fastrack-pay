"use client"
import { DataTable } from "@/components/pages/company/data-table";
import { customersData } from "@/lib/data/mochup";

import { ColumnDef } from "@tanstack/react-table"
import { CheckIcon, XIcon } from "lucide-react";
import { useState } from "react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Customer = {
  id: string
  name: string
  product: string
  price: number
  status: "pending" | "success" | "failed"
  recurring: boolean
  interval: number
}

const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "product",
    header: "Product",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      return <div>{row.original.price} USDC</div>
    }
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "recurring",
    header: "Recurring",
    cell: ({ row }) => {
      if (row.original.recurring) {
        return <CheckIcon className="w-4 h-4 stroke-green-500" />
      }
      return <XIcon className="w-4 h-4 stroke-red-500" />
    }
  },
  {
    accessorKey: "interval",
    header: "Interval",
    cell: ({ row }) => {
      return <div>{row.original.interval} days</div>
    }
  },
]




export default async function Page() {
  const [customers, setCustomers] = useState<Customer[]>(customersData)


  return (
    <>
      <h1 className='text-2xl font-bold'>Customers</h1>
      <div className='mt-2 w-full'>
        <DataTable columns={columns} data={customers} />
      </div>
    </>
  )
}