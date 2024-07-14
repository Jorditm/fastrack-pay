"use client"
import { DataTable } from "@/components/pages/company/data-table";
import { Input } from "@/components/ui/CustomInput";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { subscriptionsData } from "@/lib/data/mochup";
import { zodResolver } from "@hookform/resolvers/zod";

import { ColumnDef } from "@tanstack/react-table"
import { CheckIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    price: z.number().min(1, {
        message: "Price must be at least 1.",
    }),
    type: z.string().min(2, {
        message: "Type must be at least 2 characters.",
    }),
})

export type Subscription = {
    id: string
    name: string
    price: number
    status: "pending" | "success" | "failed"
    interval: number
    recurring: boolean
}

const columns: ColumnDef<Subscription>[] = [
    {
        accessorKey: "name",
        header: "Name",
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
        accessorKey: "interval",
        header: "Interval",
        cell: ({ row }) => {
            return <div>{row.original.interval} days</div>
        }
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
    }
]




export default function Page() {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>(subscriptionsData)


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            price: 0,
            type: "",
        },
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.warn(values)
    }

    return (
        <>
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Subscriptions</h1>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="default">New Subscription</Button>
                    </SheetTrigger>
                    <SheetContent className="w-[400px] sm:w-[540px]">
                        <SheetHeader>
                            <SheetTitle>New subscription</SheetTitle>
                            <SheetDescription>
                                Add a new subscription.
                            </SheetDescription>
                        </SheetHeader>
                        <Form {...form}>
                            <form className="flex flex-col gap-2" onSubmit={form.handleSubmit(onSubmit)}>
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="name">Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="name"
                                                    value={field.value}
                                                    onChange={(e) => field.onChange(e.target.value)}
                                                    className="col-span-2 h-8"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="price">Price</FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="price"
                                                    type="number"
                                                    value={field.value}
                                                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                                    className="col-span-2 h-8"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="type">Type</FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="type"
                                                    value={field.value}
                                                    onChange={(e) => field.onChange(e.target.value)}
                                                    className="col-span-2 h-8"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit">Add Product</Button>
                            </form>
                        </Form>
                    </SheetContent>
                </Sheet>
            </div>
            <div className='mt-2 w-full'>

                <DataTable columns={columns} data={subscriptions} />
            </div>

        </>
    )
}