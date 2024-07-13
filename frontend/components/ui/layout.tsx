
export default function Layout({ sidebar, children }: { sidebar: React.ReactNode, children: React.ReactNode }) {
    return (
        <main
            className={
                'fixed top-0 left-0 flex items-start justify-start w-full'
            }
        >
            {sidebar}
            <div className="max-w-[1200px] mx-auto pl-20 pr-10 py-12 w-full overflow-y-auto min-h-screen max-h-screen">
                {children}
            </div>
        </main>
    )
}