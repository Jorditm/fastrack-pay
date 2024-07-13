"use client"
import { useEffect } from 'react'
import Layout from '@/components/ui/layout'
import { Sidebar } from '@/components/ui/sidebar'
import { redirect } from 'next/navigation'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        const user = localStorage.getItem('user')
        const userAddress = localStorage.getItem('userAddress')
        if(user){
            if(!userAddress){
                redirect('/company/customers')
            }
        }else{
            redirect('/')
        }
    }, [])

    return (
        <Layout sidebar={<Sidebar clientType="customer" routes={['payments', 'subscriptions']} />}>
            {children}
        </Layout>
    )
}
export default DashboardLayout