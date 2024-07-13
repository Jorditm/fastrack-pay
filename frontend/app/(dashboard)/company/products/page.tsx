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
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { ColumnDef } from "@tanstack/react-table"
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
    status: z.enum(["active", "inactive", "paused"]),
})

export type Payment = {
    id: string
    amount: number
    status: "active" | "inactive" | "paused"
    name: string
    type: string
}

const columns: ColumnDef<Payment>[] = [
    {
        accessorKey: "status",
        header: "Status",
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "amount",
        header: "Amount",
    },
    {
        accessorKey: "type",
        header: "Type",
    },
]


// async function getData(): Promise<Payment[]> {
//     // Fetch data from your API here.
//     return [
//         {
//             id: "728ed52f",
//             amount: 100,
//             name: "test",
//             type: "oneTime",
//             status: "active"
//         },
//         // ...
//     ]
// }


export default function Page() {
    // const data = getData()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            price: 0,
            type: "",
            status: "active"
        },
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.warn(values)
    }

    return (
        <>
            <div className="flex justify-between items-center ">
                <h1 className="text-2xl font-bold">Products</h1>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="default">Add Product</Button>
                    </SheetTrigger>
                    <SheetContent className="w-[400px] sm:w-[540px]">
                        <SheetHeader>
                            <SheetTitle>New product</SheetTitle>
                            <SheetDescription>
                                Add a new product .
                            </SheetDescription>
                        </SheetHeader>
                        <Form {...form}>
                            <form className="flex flex-col gap-6" onSubmit={form.handleSubmit(onSubmit)}>
                                <div className="flex flex-col gap-2">
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
                                                        className="col-span-2 h-10"
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
                                                        className="col-span-2 h-10"
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
                                                        className="col-span-2 h-10"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel htmlFor="status">Status</FormLabel>
                                                <FormControl>
                                                    <Select value={field.value} onValueChange={(value) => field.onChange(value)}>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="active">Active</SelectItem>
                                                            <SelectItem value="inactive">Inactive</SelectItem>
                                                            <SelectItem value="paused">Paused</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                </div>
                                <div className="w-full">
                                    <Button className="w-full" type="submit">Add Product</Button>
                                </div>
                            </form>
                        </Form>
                    </SheetContent>
                </Sheet>
            </div>
            <div className='mt-2 w-full'>
                <DataTable columns={columns} data={[]} />
            </div>

        </>
    )
}