import { Sidebar } from '@/components/ui/sidebar'
import Layout from '@/components/ui/layout'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {

    return (
        <Layout sidebar={<Sidebar clientType="company" routes={['products', 'customers']} />}>
            {children}
        </Layout>
    )
}
export default DashboardLayout