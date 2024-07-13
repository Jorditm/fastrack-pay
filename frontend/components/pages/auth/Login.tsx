"use client"

import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";

import { Web3Auth } from "@web3auth/modal";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { redirect, useRouter } from "next/navigation";
import Web3 from "web3";
import { clientId, privateKeyProvider } from "@/lib/web3auth/web3AuthProviderProps";
import web3auth from "@/lib/web3auth/provider";
import useWeb3AuthCustomProvider from "@/hooks/useWeb3Auth";


export default function Login() {
    const { provider, setProvider, loggedIn, setLoggedIn } = useWeb3AuthCustomProvider();
    const [user, setUser] = useState<any>(null)
    const [wallets, setWallets] = useState([])
    const router = useRouter()

    useEffect(() => {
        const init = async () => {
            try {
                await web3auth.initModal();
                setProvider(web3auth.provider);
                if (web3auth.connected) {
                    setLoggedIn(true);
                }
            } catch (error) {
                console.error(error);
            }
        };
        init();
    }, []);


    useEffect(() => {
        if (wallets.length > 0 && user) {
            localStorage.setItem("user", JSON.stringify({ user, wallet: wallets[0] }))
            router.push("/setup")
        }
    }, [wallets, user])

    const login = async () => {
        const web3authProvider = await web3auth.connect();
        setProvider(web3authProvider);
        if (web3auth.connected) {
            setLoggedIn(true);
            const user = await getUserInfo()
            if (user) {
                setUser(user)
            }
            const connectedWallets = await getAccounts()
            if (connectedWallets && connectedWallets.length > 0) {
                setWallets(connectedWallets as any)
            }
        }
    };

    const logout = async () => {
        await web3auth.logout();
        setProvider(null);
        setLoggedIn(false);
    };

    const getUserInfo = async () => {
        const user = await web3auth.getUserInfo();
        return user
    };

    const getAccounts = async () => {
        if (!provider) {
            console.error("provider not initialized yet");
            return
        }
        const web3 = new Web3(provider as any);

        // Get user's Ethereum public address
        const address = await web3.eth.getAccounts();
        return address
    };


    return (
        <div className="flex gap-4">

            {loggedIn ? (
                <Button variant="secondary" onClick={logout}
                >
                    Log out
                </Button>
            ) : (
                <Button variant="secondary" onClick={login}
                >
                    Connect
                </Button>
            )}
        </div>
    )
}