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
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import Web3 from "web3";
import web3auth from "@/lib/web3auth/provider";
import { CONTRACT_ADDRESS } from "@/lib/constants";
import { abi } from '@/lib/wagmi/companyAbi'
import useSession from "@/hooks/useSession";
import useWeb3AuthCustomProvider from "@/hooks/useWeb3Auth";


const formSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }),
    price: z.number().min(1, {
        message: "Price must be at least 1.",
    }),
    description: z.string().min(2, {
        message: "Description must be at least 2 characters.",
    }),
    recurring: z.string().min(2, {
        message: "Recurring must be at least 2 characters.",
    }),
    available: z.string().min(2, {
        message: "Available must be at least 2 characters.",
    }),
    interval: z.number().min(0, {
        message: "Interval must be at least 0.",
    }).nullable().optional(),
})

export type Product = {
    id: string
    title: string
    price: number
    description: string
    recurring: boolean
    available: boolean
    interval: number
}

export const columns: ColumnDef<Product>[] = [
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "price",
        header: "Price",
    },
    {
        accessorKey: "recurring",
        header: "Recurring",
    },
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        accessorKey: "available",
        header: "Available",
    },
    {
        accessorKey: "interval",
        header: "Interval",
    },
]





export default function Page() {
    const [products, setProducts] = useState<Product[]>([])
    const { user, wallet } = useSession()
    const { setProvider, setLoggedIn } = useWeb3AuthCustomProvider()

    const provider = new Web3(web3auth.provider as any)
    
    async function getAllProducts(): Promise<void> {
            const contract = new provider.eth.Contract(JSON.parse(JSON.stringify(abi)), CONTRACT_ADDRESS);
            const allProducts = await contract.methods.getProducts().call();
            console.log("allProducts -->", allProducts)
            setProducts(allProducts as Product[])
    }

    useEffect(() => {
            getAllProducts()
    }, [provider, setProvider])


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            price: 0,
            description: "",
            recurring: "false",
            available: "false",
            interval: 0
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values)
        const web3 = provider
        const contract = new web3.eth.Contract(
            JSON.parse(JSON.stringify(abi)),
            CONTRACT_ADDRESS
        )
        const parsedValues = {
            title: values.title,
            price: Number(values.price),
            description: values.description,
            recurring: values.recurring === "true" ? true : false,
            available: values.available === "true" ? true : false,
            interval: Number(values.interval) * 86400,
            imageUrl: "https://picsum.photos/id/40/4106/2806"
        }
        console.log(parsedValues)
        const result = await contract.methods
            .createProduct(parsedValues)
            .send({ from: wallet as string })
        if (result) {
            console.log(result)
            // const productContract = "0x" + result?.events?.ProductCreated.data.slice(-40)
            // localStorage.setItem('product', productContract.toString())
            // redirect('/company/products')
        }
    }

    useEffect(() => {
        form.setValue("interval", 0)
    }, [form.watch("recurring")])


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
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel htmlFor="title">Product title</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        id="title"
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
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem className="">
                                                <FormLabel htmlFor="description">Description</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        id="description"
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
                                        name="recurring"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel htmlFor="recurring">Recurring payment</FormLabel>
                                                <FormControl>
                                                    <Select value={field.value} onValueChange={(value) => field.onChange(value)}>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value={"true"}>Yes</SelectItem>
                                                            <SelectItem value={"false"}>No</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    {form.watch("recurring") === "true" && (
                                        <FormField
                                            control={form.control}
                                            name="interval"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel htmlFor="interval">Interval (in days)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            id="interval"
                                                            type="number"
                                                            value={field.value as number}
                                                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                                            className="col-span-2 h-10"
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    )}
                                    <FormField
                                        control={form.control}
                                        name="available"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel htmlFor="available">Available</FormLabel>
                                                <FormControl>
                                                    <Select value={field.value} onValueChange={(value) => field.onChange(value)}>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value={"true"}>Yes</SelectItem>
                                                            <SelectItem value={"false"}>No</SelectItem>
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
            <div className="container mx-auto py-10">
                <DataTable columns={columns} data={[]} />
            </div>

        </>
    )
}