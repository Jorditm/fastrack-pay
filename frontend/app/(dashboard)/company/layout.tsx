"use client"
import { Sidebar } from '@/components/ui/sidebar'
import Layout from '@/components/ui/layout'
import { useEffect, useState } from 'react'
import { redirect } from 'next/navigation'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    // useEffect(() => {
    //     const user = localStorage.getItem('user')
    //     const companyAddress = localStorage.getItem('companyAddress')
    //     if(user){
    //         if(!companyAddress){
    //             redirect('/customer/payments')
    //         }
    //     }else{
    //         redirect('/')
    //     }
    // }, [])
    

    return (
        <Layout sidebar={<Sidebar clientType="company" routes={['products', 'customers']} />}>
            {children}
        </Layout>
    )
}
export default DashboardLayout