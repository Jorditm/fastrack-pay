'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRightIcon, CreditCardIcon, HomeIcon, PlusIcon, UserIcon } from 'lucide-react'

interface SidebarProps {
    routes: string[]
    clientType: "company" | "customer"   
}
export function Sidebar({ routes, clientType }: SidebarProps) {


    const router = useRouter()
    const [sidebarIsClosed, setSidebarIsclosed] = useState(true)

    function getIcon(route: string) {
        const icons: Record<string, JSX.Element> = {
            products: <HomeIcon />,
            customers: <UserIcon />,
            payments: <CreditCardIcon />,
            subscriptions: <PlusIcon />,

        }
        return icons[route] ?? <HomeIcon />
    }

    const navbarLinks = routes.map((route: string) => {
        return {
            name: route,
            Icon: getIcon(route),
            route: `/${clientType}/${route}`,
            visible: true,
        }
    })

    return (
        <motion.div
            animate={{
                width: sidebarIsClosed ? 45 : 250,
            }}
            className={cn(
                'z-50 fixed top-0 left-0 flex flex-col px-3 pt-10 pb-16 gap-1 items-center justify-between min-h-screen bg-primary'
            )}
        >
            <div className={cn(sidebarIsClosed ? 'w-10' : 'w-full')}>
                <div className={cn('w-full mb-4 text-black', sidebarIsClosed && 'hidden')}>
                    <motion.div
                        animate={{
                            opacity: sidebarIsClosed ? 0 : 1,
                        }}
                        transition={{ delay: 0.25 }}
                        className={cn(
                            'text-lg font-bold',
                            sidebarIsClosed && 'hidden'
                        )}
                    >
                        <div className={'relative w-full'}>
                            <h1
                                className={
                                    'text-3xl font-bold tracking-wider'
                                }
                            >
                                Fastrack Pay
                            </h1>

                        </div>
                    </motion.div>
                </div>
                <motion.div
                    animate={{
                        opacity: sidebarIsClosed ? 1 : 0,
                    }}
                    transition={{ delay: 0.25 }}
                    className={cn(
                        'text-3xl font-bold w-6 mx-auto pl-0.5 mb-4',
                        !sidebarIsClosed && 'hidden'
                    )}
                >
                    <Image src="/favicon.ico" alt="Logo" width={40} height={40} />
                </motion.div>
                {/* <Separator /> */}
                <div className="w-full flex flex-col gap-2 items-center justify-start my-4">
                    {
                        navbarLinks.map((section: { route?: any; name?: any; visible?: any; Icon?: any }) => {
                            const { Icon } = section
                            return (
                                <button
                                    onClick={() => {
                                        setSidebarIsclosed(true)
                                        router.push(section.route)
                                    }}
                                    key={section.name}
                                    className={cn(
                                        'w-full items-center justify-start group gap-1.5 text-sm  min-h-[2rem] capitalize',
                                        section.visible
                                            ? 'inline-flex'
                                            : 'hidden',
                                        sidebarIsClosed && 'pl-2'
                                    )}
                                >
                                    <Icon.type
                                        className={
                                            'stroke-1 stroke-black w-5 h-5 group-hover:stroke-gray-400'
                                        }
                                    />
                                    <motion.p
                                        animate={{
                                            opacity: sidebarIsClosed ? 0 : 1,
                                        }}
                                        transition={{ delay: 0.25 }}
                                        className={cn(
                                            'pt-0.5 flex items-center group-hover:text-gray-400 w-full tracking-wide text-black',
                                            sidebarIsClosed && 'hidden'
                                        )}
                                    >
                                        {section.name}
                                    </motion.p>
                                </button>
                            )
                        })
                    }
                </div>
            </div>
            <ArrowButton
                sidebarIsClosed={sidebarIsClosed}
                setSidebarIsclosed={setSidebarIsclosed}
            />
        </motion.div>
    )
}


const ArrowButton = ({
    sidebarIsClosed,
    setSidebarIsclosed,
}: {
    sidebarIsClosed: boolean
    setSidebarIsclosed: (value: boolean) => void
}) => {
    return (
        <motion.button
            onClick={() => setSidebarIsclosed(!sidebarIsClosed)}
            animate={{
                rotate: sidebarIsClosed ? 0 : 180,
            }}
            transition={{ delay: 0.25 }}
            className={cn(
                'z-20 absolute bottom-3 -right-3 rounded-full w-7 h-7 border border-white p-1 bg-gray-900'
            )}
        >
            <ChevronRightIcon className={'stroke-white w-5 h-5'} />
        </motion.button>
    )
}

