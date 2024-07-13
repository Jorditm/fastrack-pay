'use server'
import { Sidebar } from '@/components/ui/sidebar'

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {

    return (
        <main
            className={
                'fixed top-0 left-0 flex items-start justify-start w-full'
            }
        >
            <Sidebar clientType="company" routes={['products', 'customers']} />
            <div className="pl-20 py-12 w-full overflow-y-auto min-h-screen max-h-screen">
                {children}
            </div>
        </main>
    )
}
export default DashboardLayout