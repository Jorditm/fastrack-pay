import Layout from '@/components/ui/layout'
import { Sidebar } from '@/components/ui/sidebar'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {

    return (
        <Layout sidebar={<Sidebar clientType="customer" routes={['payments', 'subscriptions']} />}>
            {children}
        </Layout>
    )
}
export default DashboardLayout