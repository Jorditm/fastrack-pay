"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/CustomInput";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";

const FormSchema = z.object({
    companyName: z.string().min(1, "Company name is required"),
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    available: z.string().min(1, "Available is required"),
    recurring: z.string().min(1, "Recurring is required"),
    interval: z.string().min(1, "Interval is required"),
});

export default function Checkout() {
    const [type, setType] = useState<"company" | "person">("company");
    const router = useRouter();


    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            companyName: "",
            title: "",
            description: "",
            available: "",
            recurring: "",
            interval: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        const { companyName, title, description, available, recurring, interval } = data;
        console.warn("data from signup company", data);
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-primary p-4 lg:bg-gray-100">
            <Card className="flex flex-col items-center justify-center overflow-hidden rounded-lg p-12 lg:h-full lg:w-full lg:p-4">
                {/* <div className="flex items-start justify-start gap-4">
                    <Image
                        src="/fastrackpay-icon.png"
                        alt="Login Image"
                        className="object-cover object-center"
                        width={50}
                        height={50}
                    />
                    <p className="pt-1.5 text-3xl font-bold text-primary">
                        Fastrack Pay
                    </p>
                </div> */}
                <div className="w-full max-w-[1200px] flex justify-between items-center content-center">

                    <div className="w-1/2 flex flex-col items-center justify-center gap-6">
                        <div className=" w-72 flex flex-col items-start justify-start">
                            <div className="flex flex-col items-start justify-start">

                                <p className="">Price</p>
                                <p className="text-2xl">2ETH</p>
                            </div>
                        </div>
                        <div className="w-72 h-72 flex items-center justify-center border border-primary rounded-lg">
                            Image product
                        </div>
                    </div>
                    <div className="w-1/2 flex items-center justify-center">
                        <div className="flex w-2/3 flex-col items-center justify-center gap-4 ">
                            <div className="grid gap-2 text-center">
                                <h1 className="text-3xl font-bold">Checkout</h1>
                            </div>
                            <div className="flex w-full flex-col gap-6">
                                <Form {...form}>
                                    <form className="w-full flex flex-col gap-6" onSubmit={form.handleSubmit(onSubmit)}>
                                        <div className="fw-full lex flex-col gap-2">
                                            <FormField
                                                control={form.control}
                                                name="companyName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel htmlFor="name">Company name</FormLabel>
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
                                                name="title"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel htmlFor="price">Product title</FormLabel>
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
                                                name="description"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel htmlFor="status">Description</FormLabel>
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
                                                name="available"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel htmlFor="status">Available</FormLabel>
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
                                                name="recurring"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel htmlFor="status">Recurring</FormLabel>
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
                                                name="interval"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel htmlFor="status">Interval</FormLabel>
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

                                        </div>
                                        <div className="w-full">
                                            <Button className="w-full" type="submit">Pay</Button>
                                        </div>
                                    </form>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>

    );
}